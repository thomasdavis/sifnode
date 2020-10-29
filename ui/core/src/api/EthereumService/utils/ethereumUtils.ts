import JSBI from "jsbi";
import Web3 from "web3";
import {
  IpcProvider,
  provider,
  TransactionReceipt,
  WebsocketProvider,
} from "web3-core";

import { ETH } from "../../../constants";
import { Address, Asset, AssetAmount, Token } from "../../../entities";
import B from "../../../entities/utils/B";
import { isToken } from "../../../entities/utils/isToken";

import erc20TokenAbi from "./erc20TokenAbi";

export function getTokenContract(web3: Web3, asset: Token, contractAbi?: any) {
  if (!contractAbi) {contractAbi = erc20TokenAbi}
  return new web3.eth.Contract(contractAbi, asset.address);
}

export async function getTokenBalance(
  web3: Web3,
  address: Address,
  asset: Token
) {
  const contract = getTokenContract(web3, asset);
  let tokenBalance = "0";
  try {
    tokenBalance = await contract.methods.balanceOf(address).call();
  } catch (err) {
    console.log(`Error fetching balance for ${asset.symbol}`);
  }
  return AssetAmount(asset, B(tokenBalance, 0));
}

export function isEventEmittingProvider(
  provider?: provider
): provider is WebsocketProvider | IpcProvider {
  if (!provider || typeof provider === "string") return false;
  return typeof (provider as any).on === "function";
}

// Transfer token or ether
export async function transferAsset(
  web3: Web3,
  fromAddress: Address,
  toAddress: Address,
  amount: JSBI,
  asset?: Asset
) {
  if (isToken(asset)) {
    return await transferToken(web3, fromAddress, toAddress, amount, asset);
  }

  return await transferEther(web3, fromAddress, toAddress, amount);
}

// Transfer token
export async function transferToken(
  web3: Web3,
  fromAddress: Address,
  toAddress: Address,
  amount: JSBI,
  asset: Token
) {
  const contract = getTokenContract(web3, asset);
  return new Promise<string>((resolve, reject) => {
    let hash: string;
    let receipt: boolean;

    function resolvePromise() {
      if (receipt && hash) resolve(hash);
    }

    contract.methods
      .transfer(toAddress, JSBI.toNumber(amount))
      .send({ from: fromAddress })
      .on("transactionHash", (_hash: string) => {
        hash = _hash;
        resolvePromise();
      })
      .on("receipt", (_receipt: boolean) => {
        receipt = _receipt;
        resolvePromise();
      })
      .on("error", (err: any) => {
        reject(err);
      });
  });
}


// This is draft code which points to feature/clp branch /testnet-contract test methods
// see also https://docs.google.com/spreadsheets/d/1O5_CSK0ueQYl-XO609M1n2yyx1hyIZzkQefdh9uX2Rc/edit#gid=0
// https://web3js.readthedocs.io/en/v1.2.0/web3-eth-contract.html
export async function swapToken(
  web3: Web3,
  fromAddress: Address,
  toCosmosAddress: Address,
  amount: JSBI,
  asset: Token
) {
  const contractAbi = ""
  const contract = getTokenContract(web3, asset, contractAbi);
  return new Promise<string>((resolve, reject) => {
    let hash: string;
    let receipt: boolean;

    function resolvePromise() {
      if (receipt && hash) resolve(hash);
    }

    contract.methods
      // https://github.com/Sifchain/sifnode/blob/feature/clp/testnet-contracts/test/test_bridgeBank.js#L375
      // this.bridgeBank.lock(
      //   this.recipient,
      //   this.token2.address,
      //   this.amount, {
      //     from: userOne,
      //     value: 0
      //   }
      // )
      .lock(toCosmosAddress, JSBI.toNumber(amount))
      .send({ from: fromAddress })
      .on("transactionHash", (_hash: string) => {
        hash = _hash;
        resolvePromise();
      })
      .on("receipt", (_receipt: boolean) => {
        receipt = _receipt;
        resolvePromise();
      })
      .on("error", (err: any) => {
        reject(err);
      });
  });
}

// Transfer ether
export async function transferEther(
  web3: Web3,
  fromAddress: Address,
  toAddress: Address,
  amount: JSBI
) {
  return new Promise<string>((resolve, reject) => {
    let hash: string;
    let receipt: TransactionReceipt;

    function resolvePromise() {
      if (receipt && hash) resolve(hash);
    }

    web3.eth
      .sendTransaction({
        from: fromAddress,
        to: toAddress,
        value: amount.toString(),
      })
      .on("transactionHash", (_hash: string) => {
        hash = _hash;
        resolvePromise();
      })
      .on("receipt", (_receipt) => {
        receipt = _receipt;
        resolvePromise();
      })
      .on("error", (err: any) => {
        reject(err);
      });
  });
}

export async function getEtheriumBalance(web3: Web3, address: Address) {
  const ethBalance = await web3.eth.getBalance(address);
  return AssetAmount(ETH, web3.utils.fromWei(ethBalance));
}
