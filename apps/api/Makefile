# Default to development environment unless specified otherwise
ENV ?= dev

# Detect environment from the shell
ifeq ($(ENV),prod)
	NODE_ENV=production
	DB_MIGRATE_CMD=prisma migrate deploy
	CDK_DEPLOY_FLAGS=--require-approval never
else
	NODE_ENV=development
	DB_MIGRATE_CMD=prisma migrate dev
	CDK_DEPLOY_FLAGS=
endif

# Install dependencies and configure environment
setup:
	@echo "Setting up environment $(ENV)..."
	aws secretsmanager get-secret-value --secret-id $(ENV)/api/env | jq -r ".SecretString | fromjson | to_entries | .[] | .key + \"=\" + .value" > .env
	npm install

# Start Redis
redis:
	@echo "Starting Redis..."
	docker run -p 6379:6379 --name oktavolt-redis -d redis

# Run the application
dev:
	@echo "Running dev in $(ENV) environment..."
	npx turbo run dev --filter=api

# Build the application
build:
	@echo "Building in $(ENV) environment..."
	npx turbo run build --filter=api

# Run tests in watch mode
test-watch:
	@echo "Running tests in watch mode..."
	vitest

# Run tests
test: build
	@echo "Running tests..."
	vitest run

# Deploy to AWS using CDK
deploy-cdk:
	@echo "Deploying to AWS with CDK for $(ENV)..."
	cdk deploy --all $(CDK_DEPLOY_FLAGS)

# Full deployment pipeline
deploy: test deploy-cdk
	@echo "Deployment complete for $(ENV)."


# Run the API Docker container
docker-run-api:
	docker run -p 8080:8080 --env-file .env oktavolt-api


.PHONY: setup build dev test deploy-cdk deploy