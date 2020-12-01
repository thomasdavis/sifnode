# end to end test

## start truffle, sifnoded and relayer

1. Build sifchain and initialize genesis & run ganache

```
./script/_init.sh
./script/_run_1.sh
```

3. In a second terminal deploy contracts and run sifnode

```
./script/_run_2.sh
```

4. In a third terminal run ebrelayer

```
./script/_run_3.sh
```

### case 1: lock eth and send to cosmos user2 from eth operator account

1. check the balance of operator before lock

```
yarn peggy:getTokenBalance 0x627306090abaB3A6e1400e9345bC60c78a8BEf57 eth
```

Should be `99753182884080000000`

2. check the balance of 'BridgeBank' contract before lock

```
yarn peggy:getTokenBalance 0x75c35C980C0d37ef46DF04d31A140b65503c0eEd eth
```

Should be `0`

3. check the user balance before lock

```
sifnodecli query account $(sifnodecli keys show user2 -a)
```

Should have no `ceth`

4. Lock ethereum

```
yarn peggy:lock $(sifnodecli keys show user2 -a) 0x0000000000000000000000000000000000000000 1000000000000000000
```

5. check the balance of operator after lock

```
yarn peggy:getTokenBalance 0x627306090abaB3A6e1400e9345bC60c78a8BEf57 eth
```

should be `98751644484080000000` 1 eth short

6. check the ballance of contract after lock

```
yarn peggy:getTokenBalance 0x75c35C980C0d37ef46DF04d31A140b65503c0eEd eth
```

7. check the user2 balance after lock

```
sifnodecli query account $(sifnodecli keys show user2 -a)
```

### case 2: burn user2's eth in cosmos then asset to back to ethereum's validator account

1. check the validator's balance before burn

```
yarn peggy:getTokenBalance 0xf17f52151EbEF6C7334FAD080c5704D77216b732 eth
sifnodecli query account $(sifnodecli keys show user2 -a)
```

2. send burn tx in cosmos

```
sifnodecli tx ethbridge burn $(sifnodecli keys show user2 -a) 0xf17f52151EbEF6C7334FAD080c5704D77216b732 1000000000000000000 ceth --ethereum-chain-id=5777 --from=user2 --yes
```

3. check user2's account

```
yarn peggy:getTokenBalance 0xf17f52151EbEF6C7334FAD080c5704D77216b732 eth
sifnodecli query account $(sifnodecli keys show user2 -a)
```

### case 3: lock rowan in cosmos then issue the token in ethereum

```
sifnodecli tx ethbridge lock $(sifnodecli keys show user2 -a) 0xf17f52151EbEF6C7334FAD080c5704D77216b732 1 rwn --ethereum-chain-id=5777 --from=user2 --yes
```

1. check the balance of user2 peggyatom in ethereum

```
yarn peggy:getTokenBalance 0xf17f52151EbEF6C7334FAD080c5704D77216b732 0x409Ba3dd291bb5D48D5B4404F5EFa207441F6CbA
sifnodecli query account $(sifnodecli keys show user2 -a)
```

### case 4: burn rowan in ethereum and rowan will be back to cosmos

```
yarn peggy:burn $(sifnodecli keys show user2 -a) 0x409Ba3dd291bb5D48D5B4404F5EFa207441F6CbA 1
```

1. check balance after burn

```
yarn peggy:getTokenBalance 0xf17f52151EbEF6C7334FAD080c5704D77216b732 0x409Ba3dd291bb5D48D5B4404F5EFa207441F6CbA
sifnodecli query account $(sifnodecli keys show user2 -a)
```
