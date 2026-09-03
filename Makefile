include .env

COMPOSE := docker compose
COMMANDS := help build up down restart k6-test check quality format
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

check:
	npx eslint tests/  --max-warnings=0
	npx prettier tests/  --check

quality:
	npx eslint tests/ --fix

format:
	npx prettier tests/  --write

%:
	@: