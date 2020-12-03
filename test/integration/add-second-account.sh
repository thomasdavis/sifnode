#!/bin/bash

set -euo pipefail

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
. ${SCRIPT_DIR}/configuration/parameters
  
PASSWORD=$(yq r network-definition.yml "(*==$MONIKER).password")

yes $PASSWORD | sifnodecli keys add user1

yes $PASSWORD | sifnodecli keys show user1 >> /network-definition.yml

