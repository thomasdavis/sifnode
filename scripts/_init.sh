#!/usr/bin/env bash

killall sifnoded sifnodecli

rm $(which sifnoded) 2> /dev/null || echo sifnoded not install yet ...
rm $(which sifnodecli) 2> /dev/null || echo sifnodecli not install yet ...

rm -rf ~/.sifnoded
rm -rf ~/.sifnodecli

make install

sifnoded init test --chain-id=sifchain

sifnodecli config output json
sifnodecli config indent true
sifnodecli config trust-node true
sifnodecli config chain-id sifchain
sifnodecli config keyring-backend test

echo "Generating deterministic account - user1"
echo "race draft rival universe maid cheese steel logic crowd fork comic easy truth drift tomorrow eye buddy head time cash swing swift midnight borrow" | sifnodecli keys add user1 --recover

echo "Generating deterministic account - user2"
echo "hand inmate canvas head lunar naive increase recycle dog ecology inhale december wide bubble hockey dice worth gravity ketchup feed balance parent secret orchard" | sifnodecli keys add user2 --recover

sifnoded add-genesis-account $(sifnodecli keys show user1 -a) 1000rwn,100000000stake
sifnoded add-genesis-account $(sifnodecli keys show user2 -a) 1000rwn,100000000stake

sifnoded gentx --name user1 --keyring-backend test

echo "Collecting genesis txs..."
sifnoded collect-gentxs

echo "Validating genesis file..."
sifnoded validate-genesis