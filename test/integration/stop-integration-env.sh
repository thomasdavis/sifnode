#!/bin/bash

set -euo pipefail

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
. ${SCRIPT_DIR}/configuration/parameters

echo "======================"
echo 'if force killed remember to stop the services, remove non-running containers, network and untagged images'
echo "======================"
docker stop $(docker ps -aq)
docker rm -f $(docker ps -aq)
docker network rm genesis_sifchain
# Image built is untagged at 3.21 GB, this removes them to prevent devouring ones disk space
docker rmi $(docker images | grep "^<none>" | awk "{print $3}")
