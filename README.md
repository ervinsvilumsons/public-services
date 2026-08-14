# Public Services

This project provides a simple Docker Compose setup for running public services locally.

## Requirements

- Docker

## Services

- Portainer
  - Image: `portainer/portainer-ce:${PORTAINER_VERSION}`
  - Default port: `${PORTAINER_PORT}`
  - Data persisted in the `portainer-data` volume

- Prometheus
  - Image: `prom/prometheus`
  - Default port: `${PROMETHEUS_PORT}`
  - Data persisted in the `prometheus-data` volume

- Grafana
  - Image: `grafana/grafana`
  - Default port: `${GRAFANA_PORT}`
  - Data persisted in the `grafana-data` volume

- Mailhog
  - Image: `mailhog/mailhog:${MAILHOG_VERSION}`
  - WEB port: `${MAILHOG_WEB_PORT}`
  - SMTP port: `${MAILHOG_SMTP_PORT}`

- MySQL
  - Image: `mysql:${MYSQL_VERSION}`
  - Default port: `${MYSQL_PORT}`
  - Data persisted in the `mysql-data` volume
  - Initialization SQL is loaded from the `docker/mysql` directory

- PostgreSQL
  - Image: `postgres:${POSTGRES_VERSION}`
  - Default port: `${POSTGRES_PORT}`
  - Data persisted in the `postgres-data` volume
  - Initialization SQL is loaded from the `docker/postgres` directory

- Redis
  - Image: `redis:${REDIS_VERSION}`
  - Default port: `${REDIS_PORT}`
  - Data persisted in the `redis-data` volume

- Redis Commander
  - Image: `rediscommander/redis-commander:${REDIS_COMMANDER_VERSION}`
  - Default port: `${REDIS_COMMANDER_PORT}`

- Nginx Proxy Manager
  - Image: `jc21/nginx-proxy-manager:${NGINX_PROXY_MANAGER_VERSION}`
  - Admin panel port: `${NGINX_PROXY_MANAGER_PORT}`
  - HTTP port: `80`
  - HTTPS port: `443`
  - Data persisted in the `nginx-proxy-manager-data` volume
  - Encryption persisted in the `nginx-proxy-manager-letsencrypt` volume

## Setup Instructions for Nginx Proxy Manager

Nginx Proxy Manager allows you to easily reverse proxy to your other services and manage SSL certificates. Follow the instructions below for your operating system.

<details>
<summary><strong>Windows</strong></summary>

1. **Add hosts to your hosts file:**
   - Open Notepad as Administrator
   - Navigate to: `C:\Windows\System32\drivers\etc\hosts`
   - Add the following entries at the end of the file:
     ```
     127.0.0.1   portainer.local
     127.0.0.1   prometheus.local
     127.0.0.1   grafana.local
     127.0.0.1   mailhog.local
     127.0.0.1   redis-commander.local
     ```
   - Save the file

2. **Access Nginx Proxy Manager:**
   - Open your browser and go to: `http://localhost:81`
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
     127.0.0.1   portainer.local
     127.0.0.1   prometheus.local
     127.0.0.1   grafana.local
     127.0.0.1   mailhog.local
     127.0.0.1   redis-commander.local
     ```
   - Save the file (Ctrl+O, Enter, Ctrl+X)

2. **Access Nginx Proxy Manager:**
   - Open your browser and go to: `http://localhost:81`
   - Default credentials: `admin@example.com` / `changeme`
   - Change the default password immediately

3. **Create proxy hosts:**
   - In the Nginx Proxy Manager dashboard, go to "Proxy Hosts"
   - Create a new proxy for each service (e.g., Portainer, Grafana, etc.)
   - Set the domain name (e.g., `portainer.local`) and forward to `host.docker.internal` with the service port
   - Example: Forward `portainer.local` to `host.docker.internal:9000` (Portainer port)

</details>

### Important Note

**Forward to `host.docker.internal`**, not `localhost`. Since Nginx Proxy Manager runs in a Docker container, it cannot access `localhost` directly. Use `host.docker.internal` to forward to services running on the host machine.

## Getting Started

1. Clone or download this project
2. Create a `.env` file based on your needs (optional, uses defaults if not provided)
3. Run `docker-compose up -d` to start all services
4. Access services through Nginx Proxy Manager at `http://localhost:81` or directly via their configured ports