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
import ReconnectingWebSocket from "reconnecting-websocket";

import { ClpExtension, setupClpExtension } from "./x/clp";
type Handler = (a: any) => Promise<void> | void;

type TxWatcher = {
  addListener(handler: Handler): () => void;
};

function setupTxWatcher(
  socketLocation = "ws://localhost:26657/websocket",
  ws = new ReconnectingWebSocket(socketLocation)
): TxWatcher {
  let listeners: Handler[] = [];

  ws.onopen = () => {
    ws.send(
      JSON.stringify({
        jsonrpc: "2.0",
        method: "subscribe",
        id: "1",
        params: {
          query: `tm.event='Tx'`,
        },
      })
    );

    // Every transaction runs listeners
    ws.onmessage = async (event) => {
      for (var listener of listeners) {
        // awaiting each listener - we may want to change this later?
        listener(event);
      }
    };
  };
  ws.onerror = (err) => {
    console.log("ERROR:" + err);
  };

  return {
    addListener(handler: Handler) {
      listeners.push(handler);
      return () => {
        listeners = listeners.filter((listener) => listener === handler);
      };
    },
  };
}

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

  constructor(
    apiUrl: string,
    senderAddress: string,
    signer: OfflineSigner,
    gasPrice?: GasPrice,
    gasLimits?: Partial<GasLimits<CosmosFeeTable>>,
    broadcastMode?: BroadcastMode,
    watcherUrl?: string
  ) {
    super(apiUrl, senderAddress, signer, gasPrice, gasLimits, broadcastMode);
    this.lcdClient = createLcdClient(apiUrl, broadcastMode);
    this.swap = this.lcdClient.clp.swap;
    this.getPools = this.lcdClient.clp.getPools;
    this.addLiquidity = this.lcdClient.clp.addLiquidity;
    this.createPool = this.lcdClient.clp.createPool;
    this.getLiquidityProvider = this.lcdClient.clp.getLiquidityProvider;
    this.removeLiquidity = this.lcdClient.clp.removeLiquidity;

    if (watcherUrl) this.txWatcher = setupTxWatcher(watcherUrl);
  }

  subscribe(handler: Handler) {
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

  constructor(
    apiUrl: string,
    broadcastMode?: BroadcastMode,
    watcherUrl?: string
  ) {
    super(apiUrl, broadcastMode);
    this.lcdClient = createLcdClient(apiUrl, broadcastMode);
    this.swap = this.lcdClient.clp.swap;
    this.getPools = this.lcdClient.clp.getPools;
    this.addLiquidity = this.lcdClient.clp.addLiquidity;
    this.createPool = this.lcdClient.clp.createPool;
    this.getLiquidityProvider = this.lcdClient.clp.getLiquidityProvider;
    this.removeLiquidity = this.lcdClient.clp.removeLiquidity;
    if (watcherUrl) this.txWatcher = setupTxWatcher();
  }

  subscribe(handler: Handler) {
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
