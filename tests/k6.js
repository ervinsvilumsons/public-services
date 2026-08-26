import http from "k6/http";
import { check, fail, sleep } from "k6";
import { Counter } from "k6/metrics";
import { URL } from "https://jslib.k6.io/url/1.0.0/index.js";

const PROXY_MANAGER = "http://nginx-proxy-manager";
const TARGET_URL = __ENV.K6_TARGET_URL;
const TARGET_PATH = __ENV.K6_TARGET_PATH;

const CHECK_SITEMAP =
  (__ENV.K6_CHECK_SITEMAP ?? "true").toLowerCase() === "true";
const TAG_ENDPOINTS =
  (__ENV.K6_TAG_ENDPOINTS ?? "false").toLowerCase() === "true";

/**
 * Parse a numeric setting, apply its fallback, and enforce its minimum value.
 */
function numberAtLeast(value, fallback, name, minimum) {
  const number = Number(value ?? fallback);

  if (!Number.isFinite(number) || number < minimum) {
    const constraint = minimum === 0 ? ">= 0" : "> 0";

    throw new Error(`${name} must be a finite number ${constraint}`);
  }

  return number;
}

const VUS = numberAtLeast(__ENV.K6_TEST_VUS, 5, "K6_TEST_VUS", 1e-9);
const DURATION = __ENV.K6_TEST_DURATION || "10s";
const RPS = numberAtLeast(__ENV.K6_RPS, 0, "K6_RPS", 0);
const MAX_VUS = numberAtLeast(__ENV.K6_MAX_VUS, VUS * 10, "K6_MAX_VUS", 1e-9);

/**
 * Validate VUS is not bigger than MAX_VUS.
 */
if (MAX_VUS < VUS) {
  throw new Error("K6_MAX_VUS must be >= K6_TEST_VUS");
}

const MAX_REDIRECTS = numberAtLeast(
  __ENV.K6_MAX_REDIRECTS,
  5,
  "K6_MAX_REDIRECTS",
  0,
);
const SLEEP_SECONDS = numberAtLeast(
  __ENV.K6_SLEEP_SECONDS,
  1,
  "K6_SLEEP_SECONDS",
  0,
);

const RESPONSE_OK = 200;
const SITEMAP = "/sitemap.xml";
const redirectLimitExceeded = new Counter("redirect_limit_exceeded");
const sitemapSetupFailures = new Counter("sitemap_setup_failures");
const pageFailures = new Counter("page_failures");

const siteUrl = TARGET_URL ? TARGET_URL.trim().replace(/\/+$/, "") : "";
const requestBaseUrl = PROXY_MANAGER.replace(/\/+$/, "");
let target;
let targetError;

/**
 * Validate K6_TARGET_URL.
 */
if (!siteUrl) {
  targetError = "K6_TARGET_URL is required";
} else {
  try {
    target = new URL(siteUrl);

    if (target.protocol !== "http:" && target.protocol !== "https:") {
      targetError = "K6_TARGET_URL must be an absolute HTTP(S) URL";
    }
  } catch {
    targetError = "K6_TARGET_URL must be an absolute HTTP(S) URL";
  }
}

const TARGET_ORIGIN = target ? target.origin : "";
const TARGET_HOST = target ? target.host : "";
const CONFIGURATION_ERROR =
  targetError ||
  (!CHECK_SITEMAP && !TARGET_PATH
    ? "K6_TARGET_PATH is required when sitemap checks are disabled"
    : null);

/**
 * Configuration.
 */
const thresholds = {
  http_req_failed: ["rate<0.01"],
  checks: ["rate>0.99"],
  http_req_duration: ["p(95)<1000"],
};

export const options =
  RPS > 0
    ? {
        scenarios: {
          default: {
            executor: "constant-arrival-rate",
            rate: RPS,
            timeUnit: "1s",
            duration: DURATION,
            preAllocatedVUs: VUS,
            maxVUs: MAX_VUS,
            gracefulStop: "5s",
          },
        },
        thresholds,
      }
    : {
        vus: VUS,
        duration: DURATION,
        thresholds,
      };

/**
 * Convert a target URL into the URL actually requested by k6.
 *
 * Target-domain requests:
 *   https://example.com/foo
 *
 * become:
 *   http://nginx-proxy-manager/foo
 *
 * while external URLs are requested directly.
 */
function resolveUrl(url, baseUrl = TARGET_ORIGIN) {
  return new URL(url, baseUrl).toString().split("#")[0];
}

/**
 * Resolve a URL and determine whether it should use the proxy.
 */
function getRequestTarget(url) {
  const absoluteUrl = new URL(resolveUrl(url));
  const throughProxy = absoluteUrl.origin === TARGET_ORIGIN;

  return {
    url: throughProxy
      ? `${requestBaseUrl}${absoluteUrl.pathname}${absoluteUrl.search}`
      : absoluteUrl.toString(),
    targetUrl: absoluteUrl,
    throughProxy,
  };
}

/**
 * Build k6 request options, including phase and optional endpoint tags.
 */
function requestParams(requestTarget, phase = "page") {
  const params = {
    redirects: 0,

    tags: {
      phase,
    },
  };

  if (TAG_ENDPOINTS) {
    params.tags.endpoint = pathFromUrl(requestTarget.targetUrl);
  }

  if (requestTarget.throughProxy) {
    params.headers = { Host: TARGET_HOST };
  }

  return params;
}

/**
 * Return the URL pathname used for optional endpoint tagging.
 */
function pathFromUrl(url) {
  return url.pathname || "/";
}

/**
 * Follow redirects manually while preserving proxy routing and request tags.
 * Return null when the redirect limit is exceeded.
 */
function followRedirects(
  response,
  currentUrl,
  maxRedirects = MAX_REDIRECTS,
  phase = "page",
) {
  for (let redirectCount = 0; redirectCount <= maxRedirects; redirectCount++) {
    const location = response.headers.Location;

    const isRedirect =
      response.status >= 300 && response.status < 400 && Boolean(location);

    if (!isRedirect) {
      return response;
    }

    if (redirectCount === maxRedirects) {
      redirectLimitExceeded.add(1, { phase });
      return null;
    }

    currentUrl = resolveUrl(location, currentUrl);
    const requestTarget = getRequestTarget(currentUrl);

    response = http.get(requestTarget.url, requestParams(requestTarget, phase));
  }

  return null;
}

/**
 * Perform a GET while manually following redirects.
 *
 * Manual redirect handling is used because the request must continue
 * through nginx-proxy-manager while preserving the target Host header.
 */
function getRequest(url, maxRedirects = MAX_REDIRECTS, phase = "page") {
  const requestTarget = getRequestTarget(url);
  const response = http.get(
    requestTarget.url,
    requestParams(requestTarget, phase),
  );

  return followRedirects(
    response,
    requestTarget.targetUrl.toString(),
    maxRedirects,
    phase,
  );
}

/**
 * Download the sitemap index and child sitemaps, then return page URLs.
 *
 * Child sitemaps use the same redirect handling as page requests. Return an
 * error when the sitemap cannot be read or contains no page URLs.
 */
function useSitemap() {
  const sitemapResponse = getRequest(SITEMAP, MAX_REDIRECTS, "sitemap");

  if (!sitemapResponse || sitemapResponse.status !== RESPONSE_OK) {
    sitemapSetupFailures.add(1);
    return {
      urls: [],
      error: `Sitemap request failed: ${
        sitemapResponse ? sitemapResponse.status : "no response"
      }`,
    };
  }

  const sitemapUrls = extractLocations(sitemapResponse.body);

  if (sitemapUrls.length === 0) {
    sitemapSetupFailures.add(1);
    return { urls: [], error: "Sitemap contains no sub-sitemaps" };
  }

  const pageUrls = [];
  const requests = sitemapUrls.map((url) => {
    const currentUrl = resolveUrl(url);
    const requestTarget = getRequestTarget(currentUrl);

    return {
      method: "GET",
      url: requestTarget.url,
      params: requestParams(requestTarget, "sitemap"),
    };
  });
  // Initial child requests are concurrent; redirect follow-ups run individually.
  const responses = http.batch(requests);

  responses.forEach((response, index) => {
    const url = sitemapUrls[index];
    const responseUrl = resolveUrl(url);
    const finalResponse = followRedirects(
      response,
      responseUrl,
      MAX_REDIRECTS,
      "sitemap",
    );

    if (!finalResponse || finalResponse.status !== RESPONSE_OK) {
      sitemapSetupFailures.add(1);
      console.warn(
        `Sub-sitemap failed: ${url} (${finalResponse ? finalResponse.status : "no response"})`,
      );
      return;
    }

    const urls = extractLocations(finalResponse.body);

    urls
      .filter((url) => !url.toLowerCase().endsWith(".xml"))
      .forEach((url) => pageUrls.push(url));
  });

  if (pageUrls.length === 0) {
    sitemapSetupFailures.add(1);
    return { urls: [], error: "No page URLs found in sitemap" };
  }

  console.log(`Discovered ${pageUrls.length} page URLs`);

  return { urls: pageUrls };
}

/**
 * Extract <loc> values from sitemap XML.
 */
function extractLocations(xml) {
  const locations = [];
  const locationPattern = /<loc\b[^>]*>([\s\S]*?)<\/loc\s*>/gi;

  let match;

  while ((match = locationPattern.exec(xml)) !== null) {
    const location = decodeXmlEntities(match[1].trim());

    if (location) {
      locations.push(location);
    }
  }

  return locations;
}

const XML_ENTITIES = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&apos;": "'",
};

/**
 * Decode named and numeric XML entities in extracted sitemap values.
 */
function decodeXmlEntities(value) {
  return value.replace(
    /&(?:amp|lt|gt|quot|apos|#\d+|#x[\da-f]+);/gi,
    (entity) => {
      const namedValue = XML_ENTITIES[entity.toLowerCase()];

      if (namedValue !== undefined) {
        return namedValue;
      }

      const codePoint = entity.toLowerCase().startsWith("&#x")
        ? Number.parseInt(entity.slice(3, -1), 16)
        : Number.parseInt(entity.slice(2, -1), 10);

      return Number.isInteger(codePoint) && codePoint <= 0x10ffff
        ? String.fromCodePoint(codePoint)
        : entity;
    },
  );
}

/**
 * Validate configuration and discover the read-only URL dataset once.
 */
export function setup() {
  if (CONFIGURATION_ERROR) {
    fail(CONFIGURATION_ERROR);
  }

  // setup runs once; every VU receives this read-only URL dataset.
  const data = CHECK_SITEMAP ? useSitemap() : { urls: [TARGET_PATH] };

  if (data.error) {
    fail(data.error);
  }

  return data;
}

/**
 * Select a page URL, request it, record failures, and pace closed-model users.
 */
export default function (data) {
  if (!data.urls?.length) {
    return;
  }

  const path = data.urls[Math.floor(Math.random() * data.urls.length)];

  const response = getRequest(path);

  const passed = check(
    response,
    {
      "Page response exists": (r) => r !== null,
      "Page status is OK": (r) => r?.status === RESPONSE_OK,
    },
    { phase: "page" },
  );

  if (!passed) {
    pageFailures.add(1);
    console.error(
      `Request failed: ${path} -> ${response?.status ?? "no response"}`,
    );
  }

  if (RPS === 0) {
    sleep(SLEEP_SECONDS);
  }
}
