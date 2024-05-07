# Default to development environment unless specified otherwise
ENV ?= dev
DB_MIGRATE_CMD = ts-node ./lib/utils/migrate.ts
GEN_DB_MIGRATE_CMD = drizzle-kit generate:pg

# Detect environment from the shell
ifeq ($(ENV),prod)
	NODE_ENV=production
else
	NODE_ENV=development
endif

# Install dependencies and configure environment
# TODO: if no DATABASE_URL after getting env from secrets manager, set up Supabase DB
setup:
	@echo "Setting up environment $(ENV)..."
	aws secretsmanager get-secret-value --secret-id $(ENV)/database/env | jq -r ".SecretString | fromjson | to_entries | .[] | .key + \"=\" + .value" > .env
	npm install

# Generate database migrations
gen-migrate:
	@echo "Generating database migrations for $(ENV)..."
	$(GEN_DB_MIGRATE_CMD)

# Database migrations
migrate:
	@echo "Running database migrations for $(ENV)..."
	$(DB_MIGRATE_CMD)

build: setup migrate
	@echo "Building in $(ENV) environment..."
	npm run build:types
	npx turbo run build --filter=database

.PHONY: setup migrate build
