import {
  AuthExtension,
  BroadcastMode,
  CosmosClient,
  CosmosFeeTable,
  GasLimits,
  GasPrice,
  LcdClient,
  OfflineSigner,
  setupAuthExtension,
  SigningCosmosClient,
} from "@cosmjs/launchpad";

import { setupTxWatcher, TxWatcher, TxHandler } from "./TxWatcher";

import { ClpExtension, setupClpExtension } from "./x/clp";

type CustomLcdClient = LcdClient & AuthExtension & ClpExtension;

function createLcdClient(
  apiUrl: string,
  broadcastMode: BroadcastMode | undefined
): CustomLcdClient {
  return LcdClient.withExtensions(
    { apiUrl: apiUrl, broadcastMode: broadcastMode },
    setupAuthExtension,
    setupClpExtension
  );
}

type IClpApi = ClpExtension["clp"];

export class SifClient extends SigningCosmosClient implements IClpApi {
  protected readonly lcdClient: CustomLcdClient;
  protected txWatcher?: TxWatcher;

  constructor(o: {
    apiUrl: string;
    senderAddress: string;
    signer: OfflineSigner;
    gasPrice?: GasPrice;
    gasLimits?: Partial<GasLimits<CosmosFeeTable>>;
    broadcastMode?: BroadcastMode;
    watcherUrl?: string;
    txWatcher?: TxWatcher;
  }) {
    super(
      o.apiUrl,
      o.senderAddress,
      o.signer,
      o.gasPrice,
      o.gasLimits,
      o.broadcastMode
    );
    this.lcdClient = createLcdClient(o.apiUrl, o.broadcastMode);
    this.swap = this.lcdClient.clp.swap;
    this.getPools = this.lcdClient.clp.getPools;
    this.addLiquidity = this.lcdClient.clp.addLiquidity;
    this.createPool = this.lcdClient.clp.createPool;
    this.getLiquidityProvider = this.lcdClient.clp.getLiquidityProvider;
    this.removeLiquidity = this.lcdClient.clp.removeLiquidity;

    if (o.watcherUrl && !o.txWatcher)
      this.txWatcher = setupTxWatcher(o.watcherUrl);
    else this.txWatcher = o.txWatcher;
  }

  subscribe(handler: TxHandler) {
    return this.txWatcher?.addListener(handler);
  }

  swap: IClpApi["swap"];
  getPools: IClpApi["getPools"];
  addLiquidity: IClpApi["addLiquidity"];
  createPool: IClpApi["createPool"];
  getLiquidityProvider: IClpApi["getLiquidityProvider"];
  removeLiquidity: IClpApi["removeLiquidity"];
}

// How do we remove some of the duplication here? Eventually we will probably need a single client.

export class SifUnSignedClient extends CosmosClient implements IClpApi {
  protected readonly lcdClient: CustomLcdClient;
  protected txWatcher?: TxWatcher;

  constructor(o: {
    apiUrl: string;
    broadcastMode?: BroadcastMode;
    watcherUrl?: string;
    txWatcher?: TxWatcher;
  }) {
    super(o.apiUrl, o.broadcastMode);
    this.lcdClient = createLcdClient(o.apiUrl, o.broadcastMode);
    this.swap = this.lcdClient.clp.swap;
    this.getPools = this.lcdClient.clp.getPools;
    this.addLiquidity = this.lcdClient.clp.addLiquidity;
    this.createPool = this.lcdClient.clp.createPool;
    this.getLiquidityProvider = this.lcdClient.clp.getLiquidityProvider;
    this.removeLiquidity = this.lcdClient.clp.removeLiquidity;
    if (o.watcherUrl && !o.txWatcher)
      this.txWatcher = setupTxWatcher(o.watcherUrl);
    else this.txWatcher = o.txWatcher;
  }

  subscribe(handler: TxHandler) {
    console.log("subscribing");
    return this.txWatcher?.addListener(handler);
  }

  swap: IClpApi["swap"];
  getPools: IClpApi["getPools"];
  addLiquidity: IClpApi["addLiquidity"];
  createPool: IClpApi["createPool"];
  getLiquidityProvider: IClpApi["getLiquidityProvider"];
  removeLiquidity: IClpApi["removeLiquidity"];
}
