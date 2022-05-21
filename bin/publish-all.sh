#!/usr/bin/env bash
set -e -u
version=$1

cd ./packages/mocker && yarn publish --no-git-tag-version --new-version $version

cd ../../
cd ./packages/common && yarn publish --no-git-tag-version --new-version $version

cd ../../
cd ./packages/core && yarn publish --no-git-tag-version --new-version $version

cd ../../
cd ./packages/typeorm && yarn publish --no-git-tag-version --new-version $version

cd ../../
cd ./packages/cli && yarn publish --no-git-tag-version --new-version $version
