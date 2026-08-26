include .env

COMPOSE := docker compose
COMMANDS := help build up down restart k6-test self-lint self-prettier
ARGUMENTS := $(filter-out $(COMMANDS),$(MAKECMDGOALS))
SERVICES := $(if $(ARGUMENTS),$(ARGUMENTS),$(subst ",,$(STACK)))

help:
	@echo
	@echo "Services:"
	@$(foreach service,$(SERVICES),echo "  - $(service)";)

	@echo
	@echo "Commands:"
	@$(foreach command,$(COMMANDS),echo "  - $(command)";)

	@echo

build:
	$(COMPOSE) up -d --build $(SERVICES)

up:
	$(COMPOSE) up -d $(SERVICES)

down:
	$(COMPOSE) down

restart:
	$(COMPOSE) down
	$(COMPOSE) up -d $(SERVICES)

k6-test:
	$(COMPOSE) run --rm k6 run /tests/k6.js

self-lint:
	npx eslint tests/

self-prettier:
	npx prettier tests/  --write

%:
	@: