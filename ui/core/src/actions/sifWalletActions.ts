import { SigningCosmosClient } from "@cosmjs/launchpad";
import { validateMnemonic } from "bip39";
import * as SifService from "../api/SifService";
import { Mnemonic, SifAddress } from "../entities/Wallet";

export async function getCosmosBalanceAction(address: SifAddress) {
  // check if sif prefix
  return await SifService.getBalance(address);
}

export async function signInCosmosWallet(
  mnemonic: Mnemonic
): Promise<SigningCosmosClient> {
  if (!mnemonic) throw "Mnemonic must be defined";
  if (!validateMnemonic(mnemonic)) throw "Invalid Mnemonic. Not sent.";
  return await SifService.cosmosSignin(mnemonic);
}
