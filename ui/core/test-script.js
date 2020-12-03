const Web3 = require("web3");
const BigNumber = require("bignumber.js");

const provider = new Web3.providers.HttpProvider(
  process.env.WEB3_PROVIDER || "http://localhost:7545"
);
const web3 = new Web3(provider);
const NULL_ADDRESS = "0x0000000000000000000000000000000000000000";
const amount = new BigNumber("1000000000000000000");

const json = require("../../smart-contracts/build/contracts/BridgeBank.json");

return new web3.eth.Contract(
  json.abi,
  "0x75c35C980C0d37ef46DF04d31A140b65503c0eEd"
);

async function doit() {
  const cosmosRecipient = "0x75c35c980c0d37ef46df04d31a140b65503c0eed";
  const fromAccount = "0x627306090abab3a6e1400e9345bc60c78a8bef57";
  const amount = await new Promise((resolve, reject) => {
    mycontract.methods
      .lock(cosmosRecipient, coinDenom, amount)
      .send({
        from: fromAccount,
        value: coinDenom === NULL_ADDRESS ? amount : 0,
        gas: 300000, // 300,000 Gwei
      })
      .on("transactionHash", (_hash) => {
        console.log(`transactionHash:${_hash}`);
        hash = _hash;
        resolve();
      })
      .on("receipt", (_receipt) => {
        console.log(`transactionHash:${_receipt}`);
        receipt = _receipt;
        resolve();
      })
      .on("error", (err) => {
        reject(err);
      });
  });
}
