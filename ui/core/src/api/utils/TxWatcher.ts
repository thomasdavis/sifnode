import ReconnectingWebSocket from "reconnecting-websocket";

export type TxHandler = (a: any) => void;

export type TxWatcher = {
  addListener(handler: TxHandler): () => void;
};

export function setupTxWatcher(
  socketLocation = "ws://localhost:26657/websocket",
  ws = new ReconnectingWebSocket(socketLocation)
): TxWatcher {
  ws.onopen = () => {
    ws.send(
      JSON.stringify({
        jsonrpc: "2.0",
        method: "subscribe",
        id: "1",
        params: {
          query: `tm.event='NewBlock'`,
        },
      })
    );
  };

  ws.onerror = (err) => {
    console.log("ERROR:" + err);
  };

  return {
    addListener(handler: TxHandler) {
      ws.addEventListener("message", handler);
      return () => {
        ws.removeEventListener("message", handler);
      };
    },
  };
}
