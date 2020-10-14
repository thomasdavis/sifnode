<template>
  <div>
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/wallet">Wallet</router-link> |
      <router-link to="/pool">Pool</router-link>
    </div>
    <router-view />
  </div>
</template>

<script lang="ts">
import { defineComponent, provide } from "vue";
import { useCore } from "./core/useCore";

export default defineComponent({
  name: "App",
  setup() {
    const { api, state, usecases } = useCore();
    provide("api", api);
    provide("state", state);
    provide("usecases", usecases);
  },
});
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
