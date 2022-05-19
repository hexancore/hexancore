#!/usr/bin/env bash
set -u
set -a
source ${BIN_ENV_FILE}
set +a
source ${UTIL_PATH}

dockerutil::clean_all_with_label "${PROJECT_LABEL}"
