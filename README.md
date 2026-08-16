# Public Services

This project provides a simple Docker Compose setup for running public services locally.

## Requirements

- Docker

## Services

- Grafana
  - Image: `grafana/grafana`
  - Default port: `${GRAFANA_PORT}`
  - Data persisted in the `grafana-data` volume

- Mailhog
  - Image: `mailhog/mailhog:${MAILHOG_VERSION}`
  - WEB port: `${MAILHOG_WEB_PORT}`
  - SMTP port: `${MAILHOG_SMTP_PORT}`

- Minio
  - Image: `quay.io/minio/minio:${MINIO_VERSION}`
  - Default port: `${MINIO_PORT}`
  - Console port: `${MINIO_CONSOLE_PORT}`
  - Data persisted in the `minio-data` volume

- MySQL
  - Image: `mysql:${MYSQL_VERSION}`
  - Default port: `${MYSQL_PORT}`
  - Data persisted in the `mysql-data` volume
  - Initialization SQL is loaded from the `docker/mysql` directory

- Nginx Proxy Manager
  - Image: `jc21/nginx-proxy-manager:${NGINX_PROXY_MANAGER_VERSION}`
  - Admin panel port: `${NGINX_PROXY_MANAGER_PORT}`
  - HTTP port: `80`
  - HTTPS port: `443`
  - Data persisted in the `nginx-proxy-manager-data` volume
  - Encryption persisted in the `nginx-proxy-manager-letsencrypt` volume

- Ngrok
  - Image: `ngrok/ngrok:${NGROK_VERSION}`
  - Default port: `${NGROK_PORT}`
  - Auth Token: `${NGROK_AUTHTOKEN}`
  - URL: `${NGROK_URL}`

- Portainer
  - Image: `portainer/portainer-ce:${PORTAINER_VERSION}`
  - Default port: `${PORTAINER_PORT}`
  - Data persisted in the `portainer-data` volume

- PostgreSQL
  - Image: `postgres:${POSTGRES_VERSION}`
  - Default port: `${POSTGRES_PORT}`
  - Data persisted in the `postgres-data` volume
  - Initialization SQL is loaded from the `docker/postgres` directory

- Prometheus
  - Image: `prom/prometheus`
  - Default port: `${PROMETHEUS_PORT}`
  - Data persisted in the `prometheus-data` volume

- Redis
  - Image: `redis:${REDIS_VERSION}`
  - Default port: `${REDIS_PORT}`
  - Data persisted in the `redis-data` volume

- Redis Commander
  - Image: `rediscommander/redis-commander:${REDIS_COMMANDER_VERSION}`
  - Default port: `${REDIS_COMMANDER_PORT}`

## Setup Instructions for Nginx Proxy Manager

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

## Setup Instructions for Ngrok

Ngrok provides secure tunneling to expose your local services to the internet.

<details>
<summary><strong>Ngrok Setup Instructions</strong></summary>

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

## Getting Started

1. Clone or download this project
2. Create a `.env` file based on your needs (optional, uses defaults if not provided)
3. Manage your servies with `STACK=`
4. Run `make build` to start all services
5. Access services through Nginx Proxy Manager at `http://localhost:${NGINX_PROXY_MANAGER_PORT}` or directly via their configured ports

## Available Make Commands

You can use the included Makefile to simplify common operations:

- `make build` - Build and start all services in the background
- `make up` - Start all services in the background
- `make down` - Stop and remove all services
- `make restart` - Restart all services (stop and start)
- `make show` - Display the configured services list