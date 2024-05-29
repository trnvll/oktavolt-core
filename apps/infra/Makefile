# Default to development environment unless specified otherwise
ENV ?= dev

# Detect environment from the shell
ifeq ($(ENV),prod)
	NODE_ENV=production
else
	NODE_ENV=development
endif

# Install dependencies and configure environment
setup:
	@echo "Setting up environment $(ENV)..."
	npm install


