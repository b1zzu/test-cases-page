#!/usr/bin/env bash

set -ex

# Colone the integreatly-operator repsoitory and generate the tests.joson

TEST_CASES_REPO=https://github.com/b1zzu/integreatly-operator
TEST_CASES_REF=json-export
TEST_CASES_DIR=test-cases/
TESTS_OUT=src/tests.json

CURRENT_DIR=$(pwd)
WORK_DIR=$(mktemp -d)

git clone --depth 1 ${TEST_CASES_REPO} ${WORK_DIR}

cd ${WORK_DIR}

git fetch --depth 1 origin ${TEST_CASES_REF}
git checkout FETCH_HEAD

cd ${TEST_CASES_DIR}

./tools.sh export json --output ${CURRENT_DIR}/${TESTS_OUT}
