// This test must be run alongside one ganache and one sifnode instance

import createPeggyService, { IPeggyService } from ".";
import { getWeb3Provider } from "../../test/utils/getWeb3Provider";

import { AssetAmount } from "../../entities";

import WS from "jest-websocket-mock";
import { getFakeTokens } from "../EthereumService/utils/getFakeTokens";
import createSifService, { SifServiceContext } from "../SifService";

export const MNEMONIC =
  "race draft rival universe maid cheese steel logic crowd fork comic easy truth drift tomorrow eye buddy head time cash swing swift midnight borrow";

const testConfig: SifServiceContext = {
  sifAddrPrefix: "sif",
  sifApiUrl: "http://127.0.0.1:1317",
};
describe("PeggyService", () => {
  let PeggyService: IPeggyService;
  let server;
  beforeEach(async () => {
    server = new WS("ws://127.0.0.1:26657/websocket");

    PeggyService = createPeggyService({
      ...testConfig,
      bridgeBankContractAddress: "0x75c35C980C0d37ef46DF04d31A140b65503c0eEd",
      getWeb3Provider,
    });
    await server.connected;
  });

  test("pegging tokens from ethereum", async () => {
    const tokens = await getFakeTokens();
    const ETH = tokens.find((t) => t.symbol === "eth")!;
    const sifService = createSifService(testConfig);
    const address = await sifService.setPhrase(MNEMONIC);

    await PeggyService.lock(address, AssetAmount(ETH, "1"));

    const balances = await sifService.getBalance(address);

    const ethbalance = balances.find(
      ({ asset: { symbol } }) => symbol === "ceth"
    );

    await new Promise((resolve, reject) => setTimeout(resolve, 3000));
    expect(ethbalance?.toFixed()).toBe("1000000001000000000");
  });
});
