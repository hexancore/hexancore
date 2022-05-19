#!/usr/bin/env bash
set -u
set -a
source ${BIN_ENV_FILE}
set +a

docker service create \
  --name ${PROJECT}_mysql \
  --label ${PROJECT_LABEL} \
  --network=${NETWORK} \
  --mount type=tmpfs,dst=/var/lib,tmpfs-size=1024M \
  --mount type=tmpfs,dst=/tmp,tmpfs-size=128M \
  --publish 10000:3306 \
  --env MYSQL_ROOT_PASSWORD=test \
  --env MYSQL_DATABASE=hexcore_dev \
  --env MYSQL_INITDB_SKIP_TZINFO \
  -d \
  mysql:8.0.29