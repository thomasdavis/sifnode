echo "Liquidity information for akasha"
sifnodecli query clp lp catk $(sifnodecli keys show akasha -a)

sifnodecli tx clp add-liquidity \
 --from shadowfiend \
 --sourceChain ETH \
 --symbol ETH \
 --ticker catk \
 --nativeAmount 10000 \
 --externalAmount 10000 \
 --yes


sleep 10 

echo "Liquidity information for shadowfiend"

sifnodecli keys show shadowfiend -a

sifnodecli query clp lp catk $(sifnodecli keys show shadowfiend -a)
