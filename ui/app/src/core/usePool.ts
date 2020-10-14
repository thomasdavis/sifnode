import { onMounted, watch, inject } from "vue";
import { computed, ref } from "@vue/reactivity";
import { AssetAmount, State, TokenAmount, UseCases } from "../../../core";

const toOption = (selected: string = "") => (
  assetAmount: AssetAmount | null
) => {
  if (!assetAmount) return { value: "", label: "Select" };
  return {
    disabled: assetAmount.asset.symbol === selected,
    value: assetAmount.asset.symbol,
    label: `${assetAmount.asset.symbol} (${assetAmount.toFixed(2)})`,
  };
};

export function usePool() {
  const state = inject<State>("state");
  const usecases = inject<UseCases>("usecases");

  const tokenA = ref("ETH");
  const tokenB = ref("");
  const tokenAAmount = ref("0");
  const tokenBAmount = ref("0");

  onMounted(async () => {
    await usecases?.updateAvailableTokens();
  });

  watch([tokenA, tokenB, tokenAAmount, tokenBAmount], () => {
    usecases?.renderLiquidityData(
      tokenA.value,
      tokenAAmount.value,
      tokenB.value,
      tokenBAmount.value
    );
  });

  const tokenAOptions = computed(() => [
    toOption()(null),
    ...(state?.tokenBalances.map(toOption(tokenB.value)) ?? []),
  ]);

  const tokenBOptions = computed(() => [
    toOption()(null),
    ...(state?.tokenBalances.map(toOption(tokenA.value)) ?? []),
  ]);

  return {
    tokenAAmount,
    tokenBAmount,
    tokenAOptions,
    tokenBOptions,
    tokenA,
    tokenB,
  };
}
