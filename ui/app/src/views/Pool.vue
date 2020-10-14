<template>
  <div class="pool">
    <div>
      <input v-model="tokenAAmount" type="number" placeholder="Token A" />
      <select v-model="tokenA">
        <option
          v-for="option in tokenAOptions"
          :disabled="option.disabled"
          :value="option.value"
          :key="option.value"
        >
          {{ option.label }}
        </option>
      </select>
    </div>
    <div>
      <input v-model="tokenBAmount" type="number" placeholder="Token B" />
      <select v-model="tokenB">
        <option
          v-for="option in tokenBOptions"
          :disabled="option.disabled"
          :value="option.value"
          :key="option.value"
        >
          {{ option.label }}
        </option>
      </select>
    </div>
    <div></div>
  </div>
</template>

<script lang="ts">
import { onMounted, inject, defineComponent } from "vue";
import { ref, reactive } from "@vue/reactivity";
import { State, UseCases } from "../../../core";
import { usePool } from "../core/usePool";
export default defineComponent({
  name: "PoolPage",
  setup() {
    return usePool();
  },
});
</script>
