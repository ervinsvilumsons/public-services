[![Docker](https://img.shields.io/badge/Docker-required-2496ED?logo=docker&logoColor=white)](https://docs.docker.com/get-docker/)
[![Docker Compose](https://img.shields.io/badge/Docker%20Compose-%3E%3D2-2496ED?logo=docker&logoColor=white)](https://docs.docker.com/compose/)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D18.18.0-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![License](https://poser.pugx.org/captainhook/captainhook/license.svg?v=1)](https://packagist.org/packages/captainhook/captainhook)

# Public Services

This project provides a simple Docker Compose setup for running public services locally.

## 🧩 Services

<details>
<summary><strong>Grafana</strong></summary>

  - Image: `grafana/grafana`
  - Default port: `${GRAFANA_PORT}`
  - Data persisted in the `grafana-data` volume
  - [Read More](https://grafana.com/docs/)

</details>

<details>
<summary><strong>k6</strong></summary>

  - Image: `grafana/k6`
  - [Read More](https://grafana.com/docs/k6/latest/)

</details>

<details>
<summary><strong>MailHog</strong></summary>

  - Image: `mailhog/mailhog:${MAILHOG_VERSION}`
  - WEB port: `${MAILHOG_WEB_PORT}`
  - SMTP port: `${MAILHOG_SMTP_PORT}`
  - [Read More](https://mailtrap.io/blog/mailhog-explained/)

</details>

<details>
<summary><strong>MinIO</strong></summary>

  - Image: `quay.io/minio/minio:${MINIO_VERSION}`
  - Default port: `${MINIO_PORT}`
  - Console port: `${MINIO_CONSOLE_PORT}`
  - Data persisted in the `minio-data` volume
  - [Read More](https://hub.docker.com/r/minio/minio)

</details>

<details>
<summary><strong>MySQL</strong></summary>

  - Image: `mysql:${MYSQL_VERSION}`
  - Default port: `${MYSQL_PORT}`
  - Data persisted in the `mysql-data` volume
  - Initialization SQL is loaded from the `docker/mysql` directory
  - [Read More](https://dev.mysql.com/doc/)

</details>

<details>
<summary><strong>Nginx Proxy Manager</strong></summary>

  - Image: `jc21/nginx-proxy-manager:${NGINX_PROXY_MANAGER_VERSION}`
  - Admin panel port: `${NGINX_PROXY_MANAGER_PORT}`
  - HTTP port: `80`
  - HTTPS port: `443`
  - Data persisted in the `nginx-proxy-manager-data` volume
  - Encryption persisted in the `nginx-proxy-manager-letsencrypt` volume
  - [Read More](https://nginxproxymanager.com/guide/)

</details>

<details>
<summary><strong>ngrok</strong></summary>

  - Image: `ngrok/ngrok:${NGROK_VERSION}`
  - Default port: `${NGROK_PORT}`
  - Auth Token: `${NGROK_AUTHTOKEN}`
  - URL: `${NGROK_URL}`
  - [Read More](https://ngrok.com/docs/start)

</details>

<details>
<summary><strong>Portainer</strong></summary>

  - Image: `portainer/portainer-ce:${PORTAINER_VERSION}`
  - Default port: `${PORTAINER_PORT}`
  - Data persisted in the `portainer-data` volume
  - [Read More](https://docs.portainer.io/)

</details>

<details>
<summary><strong>PostgreSQL</strong></summary>

  - Image: `postgres:${POSTGRES_VERSION}`
  - Default port: `${POSTGRES_PORT}`
  - Data persisted in the `postgres-data` volume
  - Initialization SQL is loaded from the `docker/postgres` directory
  - [Read More](https://www.postgresql.org/docs/)

</details>

<details>
<summary><strong>Prometheus</strong></summary>

  - Image: `prom/prometheus`
  - Default port: `${PROMETHEUS_PORT}`
  - Data persisted in the `prometheus-data` volume
  - [Read More](https://prometheus.io/docs/prometheus/latest/getting_started/)

</details>

<details>
<summary><strong>Redis</strong></summary>

  - Image: `redis:${REDIS_VERSION}`
  - Default port: `${REDIS_PORT}`
  - Data persisted in the `redis-data` volume
  - [Read More](https://redis.io/docs/latest/)

</details>

<details>
<summary><strong>Redis Commander</strong></summary>

  - Image: `rediscommander/redis-commander:${REDIS_COMMANDER_VERSION}`
  - Default port: `${REDIS_COMMANDER_PORT}`
  - [Read More](https://github.com/joeferner/redis-commander)

</details>

## 🚀 Setup Instructions for Nginx Proxy Manager

Nginx Proxy Manager allows you to easily reverse proxy to your other services and manage SSL certificates. Follow the instructions below for your operating system.

<details>
<summary><strong>Windows</strong></summary>

1. **Add hosts to your hosts file:**
   - Open Notepad as Administrator
   - Navigate to: `C:\Windows\System32\drivers\etc\hosts`
   - Add the following entries at the end of the file:
     ```
     127.0.0.1   grafana.local
     127.0.0.1   mailhog.local
     127.0.0.1   minio.local
     127.0.0.1   nginx-proxy.local
     127.0.0.1   ngrok.local
     127.0.0.1   portainer.local
     127.0.0.1   prometheus.local
     127.0.0.1   redis-commander.local
     ```
   - Save the file

2. **Access Nginx Proxy Manager:**
   - Open your browser and go to: `http://localhost:${NGINX_PROXY_MANAGER_PORT}`
   - Default credentials: `admin@example.com` / `changeme`
   - Change the default password immediately

3. **Create proxy hosts:**
   - In the Nginx Proxy Manager dashboard, go to "Proxy Hosts"
   - Create a new proxy for each service (e.g., Portainer, Grafana, etc.)
   - Set the domain name (e.g., `portainer.local`) and forward to `host.docker.internal` with the service port
   - Example: Forward `portainer.local` to `host.docker.internal:9000` (Portainer port)

</details>

<details>
<summary><strong>Linux / macOS</strong></summary>

1. **Add hosts to your hosts file:**
   - Open terminal and edit the hosts file:
     ```bash
     sudo nano /etc/hosts
     ```
   - Add the following entries at the end of the file:
     ```
     127.0.0.1   grafana.local
     127.0.0.1   mailhog.local
     127.0.0.1   minio.local
     127.0.0.1   nginx-proxy.local
     127.0.0.1   ngrok.local
     127.0.0.1   portainer.local
     127.0.0.1   prometheus.local
     127.0.0.1   redis-commander.local
     ```
   - Save the file (Ctrl+O, Enter, Ctrl+X)

2. **Access Nginx Proxy Manager:**
   - Open your browser and go to: `http://localhost:${NGINX_PROXY_MANAGER_PORT}`
   - Default credentials: `admin@example.com` / `changeme`
   - Change the default password immediately

3. **Create proxy hosts:**
   - In the Nginx Proxy Manager dashboard, go to "Proxy Hosts"
   - Create a new proxy for each service (e.g., Portainer, Grafana, etc.)
   - Set the domain name (e.g., `portainer.local`) and forward to `host.docker.internal` with the service port
   - Example: Forward `portainer.local` to `host.docker.internal:9000` (Portainer port)

</details>

## 📦 Getting Started

1. Clone or download this project
    ```bash
    git clone git@github.com:ervinsvilumsons/public-services.git
    ```

2. Create a `.env` file from `.env.example` and adjust the values as needed:
    ```bash
    cp .env.example .env
    ```

3. Manage your services with `STACK=`
4. Start your stacked services
    ```bash
    make build
    ```
5. Access services through Nginx Proxy Manager at `http://localhost:${NGINX_PROXY_MANAGER_PORT}` or directly via their configured ports

## 🧱 Add Custom Services

<details>
<summary><strong>Instructions</strong></summary>

1. You can extend the default stack without editing `docker-compose.yml`. Create a local `docker-compose.override.yml` file in the project root:

    ```yaml
    services:
      adminer:
        image: adminer:latest
        container_name: adminer
        restart: unless-stopped
        ports:
          - "8080:8080"
        networks:
          - public-services

    networks:
      public-services:
        name: public-services
    ```

2. Docker Compose automatically merges `docker-compose.override.yml` with `docker-compose.yml`. Keep the override file local if it contains personal services or configuration. To verify the merged configuration, run:

    ```bash
    docker compose config
    ```

3. Add the service name to `STACK` in `.env` so it is started by the Makefile commands:

    ```dotenv
    STACK="portainer prometheus grafana adminer"
    ```

    or run it manually: 

    ```bash
    make build adminer
    ```

</details>

## 📈 k6 Load Testing

k6 provides load and performance testing for web applications by simulating virtual users and measuring request rates, response times, failures, and test thresholds.

<details>
<summary><strong>Instructions</strong></summary>

The k6 service sends requests through the `nginx-proxy-manager` container. Before running a test, create a Proxy Host for the target domain and make sure it forwards to the application. `K6_TARGET_URL` must match that domain, including the `http://` or `https://` scheme.

Create or update `.env`:

```dotenv
K6_TARGET_URL=http://example.local
K6_CHECK_SITEMAP=true
K6_MAX_REDIRECTS=5
```

With `K6_CHECK_SITEMAP=true`, k6 downloads `/sitemap.xml` once during `setup()`, follows sitemap redirects such as `/sitemap.xml` to `/wp-sitemap.xml`, and uses the discovered page URLs for the test. Keep `K6_MAX_REDIRECTS` greater than zero; an empty value is treated as `0` and prevents redirects from being followed.

Run the test with:

```bash
make k6-test
```

To test one path without reading a sitemap, use `K6_CHECK_SITEMAP=false` and set `K6_TARGET_PATH`:

```dotenv
K6_CHECK_SITEMAP=false
K6_TARGET_PATH=/some-page/
```

By default, the test uses a closed workload with `K6_TEST_VUS` virtual users for `K6_TEST_DURATION`. Set `K6_RPS` above zero to use a constant arrival rate instead; `K6_MAX_VUS` limits the number of virtual users k6 may allocate for that rate.

</details>

## 🚀 Setup ngrok

ngrok provides secure tunneling to expose your local services to the internet.

<details>
<summary><strong>Instructions</strong></summary>

### Prerequisites

1. **Create an Ngrok Account:**
   - Go to [https://ngrok.com](https://ngrok.com)
   - Sign up for a free account
   - Verify your email address

2. **Get Your Auth Token:**
   - Log in to your ngrok dashboard
   - Go to **Getting started** > **Your Authtoken**
   - Copy your authentication token

3. **Reserve a Static Domain (Optional but recommended):**
   - In the ngrok dashboard, go to **Network** > **Domains**
   - Click **New Domain** to reserve a static domain
   - You'll get a URL like `https://your-domain.ngrok.io`

### Configuration

1. **Update your `.env` file:**
   ```bash
   NGROK_AUTHTOKEN=your_auth_token_here
   NGROK_URL=your-domain.ngrok.io
   ```
   - Replace `your_auth_token_here` with your ngrok authentication token
   - Replace `your-domain.ngrok.io` with your reserved domain (or ngrok will assign a random URL)

2. **Start the services:**
   ```bash
   make build
   ```

3. **Access your services:**
   - Once running, ngrok will expose your services at: `https://your-domain.ngrok.io`
   - Check the ngrok status at the local inspector: `http://localhost:${NGROK_PORT}`

4. **Usage Notes:**
   - Ngrok creates a secure tunnel from your local Nginx Proxy Manager to the internet
   - All traffic is encrypted with HTTPS
   - Share your ngrok URL with others to allow external access to your local services
   - Use the ngrok inspector at `http://localhost:${NGROK_PORT}` to monitor all tunnel traffic

</details>

## ⚖️ License
[MIT](https://choosealicense.com/licenses/mit/)