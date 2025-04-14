# Makefile for generating empty Go scaffolding files

NAME ?=
TIMESTAMP := $(shell date +%Y%m%d%H%M%S)

.PHONY: help
help:
	@echo "Usage:"
	@echo "  make new-handler NAME=Something   - Create an empty handler file"
	@echo "  make new-model NAME=Something     - Create an empty model file"
	@echo "  make new-route NAME=Something     - Create an empty route file"
	@echo "  make new-migration NAME=Something - Create an empty migration file"
	@echo "  make new-repo NAME=Something      - Create an empty repository file"
	@echo "  make new-seeder NAME=Something    - Create an empty seeder file"
	@echo "  make new NAME=Something           - Create all files at once"

.PHONY: new-handler
new-handler:
	@if [ -z "$(NAME)" ]; then \
		echo "Please provide NAME=YourHandlerName"; \
		exit 1; \
	fi
	@mkdir -p internal/api/handler
	@touch internal/api/handler/$(NAME)_handler.go
	@echo "Created empty file: internal/api/handler/$(NAME)_handler.go"

.PHONY: new-model
new-model:
	@if [ -z "$(NAME)" ]; then \
		echo "Please provide NAME=YourModelName"; \
		exit 1; \
	fi
	@mkdir -p internal/database/model
	@touch internal/database/model/$(NAME).go
	@echo "Created empty file: internal/database/model/$(NAME).go"

.PHONY: new-route
new-route:
	@if [ -z "$(NAME)" ]; then \
		echo "Please provide NAME=YourRouteName"; \
		exit 1; \
	fi
	@mkdir -p internal/api/route
	@touch internal/api/route/$(NAME)_route.go
	@echo "Created empty file: internal/api/route/$(NAME)_route.go"

.PHONY: new-migration
new-migration:
	@if [ -z "$(NAME)" ]; then \
		echo "Please provide NAME=CreateSomethingTable or similar"; \
		exit 1; \
	fi
	@mkdir -p internal/database/migration
	@touch internal/database/migration/$(TIMESTAMP)_$(NAME).go
	@echo "Created empty file: internal/database/migration/$(TIMESTAMP)_$(NAME).go"

.PHONY: new-repo
new-repo:
	@if [ -z "$(NAME)" ]; then \
		echo "Please provide NAME=YourModelName for the repository"; \
		exit 1; \
	fi
	@mkdir -p internal/database/repositories
	@touch internal/database/repositories/$(NAME)_repo.go
	@echo "Created empty file: internal/database/repositories/$(NAME)_repo.go"

.PHONY: new-seeder
new-seeder:
	@if [ -z "$(NAME)" ]; then \
		echo "Please provide NAME=YourModelName for the seeder"; \
		exit 1; \
	fi
	@mkdir -p internal/database/seeder
	@touch internal/database/seeder/$(NAME)_seeder.go
	@echo "Created empty file: internal/database/seeder/$(NAME)_seeder.go"

.PHONY: new
new: new-handler new-model new-route new-migration new-repo new-seeder
	@echo "All empty files for $(NAME) have been created successfully."
