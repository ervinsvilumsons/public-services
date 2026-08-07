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