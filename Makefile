# Vars section
export BIN_ROOT_PATH = ./bin
export UTIL_ROOT_PATH = $(realpath $(BIN_ROOT_PATH)/util)
export UTIL_PATH = $(UTIL_ROOT_PATH)/util.sh

export ENV ?= dev
export BIN_COMMON_ENV_ROOT_PATH = $(BIN_ROOT_PATH)/env
export BIN_ENV_ROOT_PATH = $(BIN_COMMON_ENV_ROOT_PATH)/$(ENV)
export BIN_ENV_FILE = $(BIN_COMMON_ENV_ROOT_PATH)/$(ENV)/.env

export PROJECT = hexcore
export DEFAULT_SUBPROJECT = none
export SUBPROJECT ?= $(DEFAULT_SUBPROJECT)

include dev.env
export $(shell sed 's/=.*//' dev.env)

ifeq "$(ENV)" "dev"
  export VERSION = dev
endif
# End Vars section

# Help target settings
INFO = Showing targets for all of ENV(default: dev) and SUBPROJECT(default: $(DEFAULT_SUBPROJECT))
EXTRA_MAKE_ARGS = ENV=test|prod SUBPROJECT=$(SUBPROJECTS)
HELP_TARGET_MAX_CHAR_NUM = 30
HAS_DEPS = yes
.DEFAULT_GOAL := help
include $(UTIL_ROOT_PATH)/MakeHelp

# Check version is sets and is not help target
ifneq ($(MAKECMDGOALS),)
  ifneq ($(MAKECMDGOALS),help)
    ifndef VERSION
      $(error VERSION is not set)
    endif
  endif
endif

ifeq "$(ENV)" "dev"

## Reinitialize testing env
test_init:
	bash ${BIN_ENV_ROOT_PATH}/init.sh

## Clear testing env
test_clean:
	bash ${BIN_ENV_ROOT_PATH}/clean.sh

endif