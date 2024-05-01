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

# Catch-all rule to avoid make doing nothing for unknown goals
%:
	@:

# Declare PHONY targets
.PHONY: all dirs $(DIRS)
