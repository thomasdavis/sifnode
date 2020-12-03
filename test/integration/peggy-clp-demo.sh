#!/bin/bash

set -euo pipefail

. configuration/parameters

echo "Minting peggyeth ( minted from Peggy) using ethbridge"
## Case 1
## 1. send tx to cosmos after get the lock event in ethereum
sifnodecli tx ethbridge create-claim $CREATE_CLAIM_ADDRESS 3 eth $ETHEREUM_SENDER_ADDRESS \
$(sifnodecli keys show user2 -a) $(sifnodecli keys show user1 -a --bech val) 10000 lock \
--token-contract-address=$TOKEN_ADDRESS --ethereum-chain-id=$ETHEREUM_CHAIN_ID --from=user1 --yes

# 2. query the tx
#sifnodecli q tx

# 3. check user2 account balance
sifnodecli q auth account $(sifnodecli keys show user2 -a)

# 4. query the prophecy
sifnodecli query ethbridge prophecy $CREATE_CLAIM_ADDRESS 3 eth $ETHEREUM_SENDER_ADDRESS --ethereum-chain-id=$ETHEREUM_CHAIN_ID --token-contract-address=$TOKEN_ADDRESS

## Case 2
## 1. burn peggyetch for user2
sifnodecli tx ethbridge burn $(sifnodecli keys show user2 -a) $ETHEREUM_SENDER_ADDRESS \
10 ceth --ethereum-chain-id=$ETHEREUM_CHAIN_ID --from=user2 --yes

## 2. query the tx
#sifnodecli q tx

## 3. check user2 account balance
sifnodecli q auth account $(sifnodecli keys show user2 -a)

## Case 3
## 1. lock user2 rwn in sifchain
sifnodecli tx ethbridge lock $(sifnodecli keys show user2 -a) $ETHEREUM_SENDER_ADDRESS \
10 rwn  --ethereum-chain-id=$ETHEREUM_CHAIN_ID --from=user2 --yes

## 2. query the tx
#sifnodecli q tx

## 3. check user2 account balance
sifnodecli q auth account $(sifnodecli keys show user2 -a)

## Case 4
## 1. send tx to cosmos after erwn burn in ethereum
sifnodecli tx ethbridge create-claim $CREATE_CLAIM_ADDRESS 1 rwn $ETHEREUM_SENDER_ADDRESS \
$(sifnodecli keys show user2 -a) $(sifnodecli keys show user1 -a --bech val) \
10 burn --ethereum-chain-id=$ETHEREUM_CHAIN_ID --token-contract-address=$TOKEN_CONTRACT_ADDRESS --from=user1 --yes

## 2. query the tx
#sifnodecli q tx

## 3. check user2 account balance
sifnodecli q auth account $(sifnodecli keys show user2 -a)


echo "Creating pools for peggyeth ( minted from Peggy) and cdash"
sleep 8
yes Y | sifnodecli tx clp create-pool --from user2 --sourceChain ETHEREUM --symbol ETH --ticker ceth --nativeAmount 200 --externalAmount 200
sleep 8
yes Y | sifnodecli tx clp create-pool --from user2 --sourceChain DASH --symbol DASH --ticker cdash --nativeAmount 100 --externalAmount 100

echo "Query all pools"
sleep 8
sifnodecli query clp pools

echo "Query specific pool"
sleep 8
sifnodecli query clp pool ceth

echo "Query Liquidity Provider / Pool creator is the first lp for the pool"
sleep 8
sifnodecli query clp lp ceth $(sifnodecli keys show user2 -a)

echo "adding more liquidity"
sleep 8
yes Y | sifnodecli tx clp add-liquidity --from user2 --sourceChain ETHEREUM --symbol ETH --ticker ceth --nativeAmount 1 --externalAmount 1

echo "swap"
sleep 8
yes Y |  sifnodecli tx clp swap --from user2 --sentSourceChain ETHEREUM --sentSymbol ETH --sentTicker ceth --receivedSourceChain DASH --receivedSymbol DASH --receivedTicker cdash --sentAmount 20


echo "removing Liquidity"
sleep 8
yes Y | sifnodecli tx clp remove-liquidity --from user2 --sourceChain ETHEREUM --symbol ETH --ticker ceth --wBasis 5001 --asymmetry -1

echo "removing more Liquidity"
sleep 8
yes Y | sifnodecli tx clp remove-liquidity --from user2 --sourceChain ETHEREUM --symbol ETH --ticker ceth --wBasis 5001 --asymmetry -1



echo "decommission pool"
sleep 8
yes Y | sifnodecli tx clp decommission-pool --from user2 --ticker ceth

echo "sifnodecli query clp pools -> should list only 1 pool cdash"