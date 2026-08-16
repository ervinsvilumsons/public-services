include .env

SERVICES := $(subst ",,$(STACK))

show:
	@echo "$(SERVICES)"

build:
	docker compose up -d --build $(SERVICES)

up:
	docker compose up -d $(SERVICES)

down:
	docker compose down

restart:
	docker compose down
	docker compose up -d $(SERVICES)