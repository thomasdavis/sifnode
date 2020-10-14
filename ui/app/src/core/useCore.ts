import {
  createStore,
  createApi,
  getWeb3,
  createUsecases,
  getFakeTokens,
} from "../../../core";

export function useCore() {
  const store = createStore();
  const { state } = store;
  const api = createApi({ getWeb3, getSupportedTokens: getFakeTokens });
  const usecases = createUsecases({ store, state, api });
  return { api, state, usecases };
}
