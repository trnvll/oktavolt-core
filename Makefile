# Detect directories with Makefiles using a shell command
DIRS := $(shell find . -type f -name 'Makefile' ! -path '*/node_modules/*' -exec dirname {} \; | sort -u)

# Default rule to give instructions
all:
	@echo "Usage: make [subdir] [target]"
	@echo "For example, make apps/api build"
	@echo "Subdirectories with Makefiles: $(DIRS)"

# List directories with Makefiles
dirs:
	@echo "Directories with Makefiles: $(DIRS)"

# Delegate command to subdirectory Makefiles
$(DIRS):
	$(MAKE) -C $@ $(filter-out $@,$(MAKECMDGOALS))

# Build the API Docker image locally (for testing)
docker-build-api:
	docker build -t oktavolt-api -f apps/api/Dockerfile .

fly-secrets-api:
	cat apps/api/.env | flyctl secrets import --config fly.api.toml

# Deploy with Fly.io
fly-deploy-api:
	fly deploy --config fly.api.toml
	cat apps/api/.env | flyctl secrets import --config fly.api.toml

# Catch-all rule to avoid make doing nothing for unknown goals
%:
	@:

.PHONY: all dirs $(DIRS) docker-build-api fly-secrets-api fly-deploy-api
