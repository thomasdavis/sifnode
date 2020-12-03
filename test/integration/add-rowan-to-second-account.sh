#!/bin/bash

set -euo pipefail

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
. ${SCRIPT_DIR}/configuration/parameters

PASSWORD=$(yq r network-definition.yml "(*==$MONIKER).password")
ADDR=$(yq r network-definition.yml "(*==$MONIKER).address")

yes $PASSWORD | sifnodecli tx send $ADDR $(yes $PASSWORD | sifnodecli keys show user1 -a) "10000000rowan" -y

