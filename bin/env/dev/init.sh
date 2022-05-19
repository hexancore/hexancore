#!/usr/bin/env bash
set -u
set -a
source ${BIN_ENV_FILE}
set +a

bash ${BIN_ENV_ROOT_PATH}/clean.sh

docker network rm ${NETWORK}
sleep 1
docker network create --driver overlay --label ${PROJECT_LABEL} ${NETWORK}

bash ${BIN_ENV_ROOT_PATH}/mysql/init.sh
