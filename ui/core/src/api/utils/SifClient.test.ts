import { SifUnSignedClient } from "./SifClient";
import WS from "jest-websocket-mock";

test("SifUnSignedClient can be constructed", async () => {
  const client = new SifUnSignedClient({ apiUrl: "http://localhost:1317" });
  expect(client).not.toBeNull();
});

test("SifUnSignedClient can listen for blocks", async () => {
  const server = new WS("ws://127.0.0.1:26657/websocket");

  const client = new SifUnSignedClient({
    apiUrl: "http://localhost:1317",
    watcherUrl: "ws://127.0.0.1:26657/websocket",
  });

  await server.connected;

  const events: any[] = [];

  client.subscribe((event) => {
    events.push(JSON.parse(event.data));
  });

  const FAKE_BLOCK_1 = {
    jsonrpc: "2.0",
    id: 0,
    result: {
      query: "tm.event='NewBlock'",
      data: {
        type: "tendermint/event/NewBlock",
        value: "I am a fake minted block",
      },
      events: {
        "tm.event": ["NewBlock"],
      },
    },
  };
  const FAKE_BLOCK_2 = {
    jsonrpc: "2.0",
    id: 0,
    result: {
      query: "tm.event='NewBlock'",
      data: {
        type: "tendermint/event/NewBlock",
        value: "I am a second fake minted block",
      },
      events: {
        "tm.event": ["NewBlock"],
      },
    },
  };

  server.send(JSON.stringify(FAKE_BLOCK_1));
  server.send(JSON.stringify(FAKE_BLOCK_2));

  expect(events).toEqual([FAKE_BLOCK_1, FAKE_BLOCK_2]);
});

// {"jsonrpc": "2.0","method": "subscribe","id": 0,"params": {    "query": "tm.event='NewBlock'"}}
