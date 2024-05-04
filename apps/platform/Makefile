# Default to development environment unless specified otherwise
ENV ?= dev

# Detect environment from the shell
ifeq ($(ENV),prod)
	NODE_ENV=production
	CDK_DEPLOY_FLAGS=--require-approval never
else
	NODE_ENV=development
	CDK_DEPLOY_FLAGS=
endif

# Install dependencies and configure environment
setup:
	@echo "Setting up environment $(ENV)..."
	aws secretsmanager get-secret-value --secret-id $(ENV)/platform/env | jq -r ".SecretString | fromjson | to_entries | .[] | .key + \"=\" + .value" > .env
	npm ci

# Run the application
dev: setup
	@echo "Running dev in $(ENV) environment..."
	npx turbo run dev --filter=platform

# Build the application
build: setup
	@echo "Building in $(ENV) environment..."
	npx turbo run build --filter=platform

# Run tests
test: build
	@echo "Running tests..."
	jest

# Deploy to AWS using CDK
deploy-cdk:
	@echo "Deploying to AWS with CDK for $(ENV)..."
	cdk deploy --all $(CDK_DEPLOY_FLAGS)

# Full deployment pipeline
deploy: test deploy-cdk
	@echo "Deployment complete for $(ENV)."

.PHONY: setup build dev test deploy-cdk deploy