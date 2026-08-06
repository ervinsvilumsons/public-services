# Public Services

This project provides a simple Docker Compose setup for running public services locally.

## What is included

- MySQL service named `mysql`
- PostgreSQL service named `postgres`
- Redis service named `redis`
- Persistent Docker volumes for all services
- A shared Docker network named `public-services`
- An initialization script for MySQL databases and users

## Services

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

## Requirements

- Docker