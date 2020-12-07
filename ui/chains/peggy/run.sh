#!/bin/bash

# This script should be run with a CWD that is the local folder
. ../credentials.sh
. ../../../smart-contracts/.env

wait_for_rpc() {
  while ! nc -z localhost 26657; do
    sleep 15
  done
}

wait_for_rpc

ETHEREUM_PRIVATE_KEY=$ETHEREUM_PRIVATE_KEY ebrelayer init \
  tcp://localhost:26657 \
  ws://localhost:7545/ \
  $BRIDGE_TOKEN_ADDRESS \
  $SIFUSER1_NAME "$SIFUSER1_MNEMONIC" \
  --chain-id=sifchain \
  --gas 300000 \
  --gas-adjustment 1.5