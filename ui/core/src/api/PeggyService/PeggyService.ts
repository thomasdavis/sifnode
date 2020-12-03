import { SifUnSignedClient } from "../utils/SifClient";
import { provider, TransactionReceipt } from "web3-core";
import Web3 from "web3";
import { getBridgeBankContract } from "./BridgeBankContract";
import { AssetAmount, Token } from "../../entities";
import BigNumber from "bignumber.js";
import ReconnectingWebSocket from "reconnecting-websocket";

export type PeggyServiceContext = {
  sifApiUrl: string;
  getWeb3Provider: () => Promise<provider>;
  bridgeBankContractAddress: string;
};

const NULL_ADDRESS = "0x0000000000000000000000000000000000000000";

export type IPeggyService = {
  lock(cosmosRecipient: string, assetAmount: AssetAmount): Promise<string>;
};

export default function createPeggyService({
  getWeb3Provider,
  sifApiUrl,
  bridgeBankContractAddress,
}: PeggyServiceContext): IPeggyService {
  const sifClient = new SifUnSignedClient(sifApiUrl);

  let _web3: Web3 | null = null;
  async function ensureWeb3(): Promise<Web3> {
    if (!_web3) {
      const provider = await getWeb3Provider();
      _web3 = new Web3(provider);
    }
    return _web3;
  }

  return {
    async lock(sifRecipient: string, assetAmount: AssetAmount) {
      const cosmosRecipient = Web3.utils.utf8ToHex(sifRecipient);

      const web3 = await ensureWeb3();
      const bridgeBankContract = getBridgeBankContract(
        web3,
        bridgeBankContractAddress
      );
      (bridgeBankContract as any).setProvider(web3.currentProvider);

      const accounts = await web3.eth.getAccounts();
      const coinDenom = (assetAmount.asset as Token).address ?? NULL_ADDRESS;
      const amount = new BigNumber(assetAmount.amount.toString());
      const fromAddress = accounts[0];

      return await new Promise((resolve, reject) => {
        let hash: string;
        let receipt: TransactionReceipt;
        let newBlock = false;

        const unsubscribe = sifClient.subscribe((event) => {
          // is tx correct?

          console.log({ event });
          newBlock = true;
          resolvePromise();
          unsubscribe && unsubscribe();
        });

        function resolvePromise() {
          if (hash && receipt && newBlock) resolve(hash);
        }

        bridgeBankContract.methods
          .lock(cosmosRecipient, coinDenom, amount)
          .send({
            from: fromAddress,
            value: coinDenom === NULL_ADDRESS ? amount : 0,
            gas: 300000, // 300,000 Gwei
          })
          .on("transactionHash", (_hash: string) => {
            hash = _hash;
            resolvePromise();
          })
          .on("receipt", (_receipt: any) => {
            receipt = _receipt;
            resolvePromise();
          })
          .on("error", (err: any) => {
            reject(err);
          });
      });
    },
  };
}
