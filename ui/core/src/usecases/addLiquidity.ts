import { Context, UseCases } from ".";
import { Asset, TokenAmount } from "../entities";

export function useAddLiquidity(usecases: UseCases) {
  usecases.
}

export default ({ api, store }: Context<"tokenService">) => ({
  // Listener effects
  intializeAddLiquidityUseCase(/*  */) {
    // XXX: Need websocket listener https://docs.cosmos.network/master/core/events.html#subscribing-to-events
    //
    // const event$ = api.tendermintService.getSifchainEventStream()
    //
    // event$.subscribe(store.updateWithEvent)
    //
    // return () => {
    //   event$.unsubscribe()
    // }
  },

  // Render helpers that are business logic
  async renderLiquidityData(
    tokenASymbol: string,
    tokenAAmount: string,
    tokenBSymbol?: string,
    tokenBAmount?: string
  ) {
    /* 
: {
    tokenAPerBRatio: number; // XXX: Fraction?
    tokenBPerARatio: number;
    tokenAAmountOwned: TokenAmount;
    tokenBAmountOwned: TokenAmount;
    shareOfPool: number;
    isInsufficientFunds: boolean;
  }
*/
    const tokenA = await api.tokenService.getTokenBySymbol(tokenASymbol);

    const tokenB = tokenBSymbol
      ? await api.tokenService.getTokenBySymbol(tokenBSymbol)
      : null;
  },

  // Command and effect usecases
  async addLiquidity(amountA: TokenAmount, amountB: TokenAmount) {
    // get wallet balances from store etc.
    //
    // store.setAddLiquidityTransactionInitiated()
    //
    // ...
    //
    // await api.transactionService.broadcast(tx)
    //
    // if error store.setAddLiquidityTransactionError(error)
    //
    // store.setAddLiquidityTransactionCompleted()
  },
});
