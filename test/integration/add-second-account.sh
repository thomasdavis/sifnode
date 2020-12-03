#!/bin/bash

set -euo pipefail

PASSWORD=$(yq r network-definition.yml "(*==$MONIKER).password")

yes $PASSWORD | sifnodecli keys add user1

yes $PASSWORD | sifnodecli keys show user1 >> /network-definition.yml

