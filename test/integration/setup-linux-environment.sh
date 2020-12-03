#!/bin/bash 

set -euo pipefail

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
. ${SCRIPT_DIR}/configuration/parameters

# Sets up a bare Ubuntu environment with all the tools we use
# for integration tests

set -e

scriptdir=$(dirname $0)

sudo bash $scriptdir/setup-linux-environment-root.sh $USER
bash $scriptdir/setup-linux-environment-user.sh
