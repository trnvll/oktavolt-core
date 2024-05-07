# Default to development environment unless specified otherwise
ENV ?= dev

# Detect environment from the shell
ifeq ($(ENV),prod)
	NODE_ENV=production
else
	NODE_ENV=development
endif

build:
	@echo "Building in $(ENV) environment..."
	npm run build:types
	npx turbo run build --filter=database

install:
	npm install
