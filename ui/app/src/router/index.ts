import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import Home from "../views/Wallet.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Home",
    component: () =>
      import(/* webpackChunkName: "wallet" */ "../views/Home.vue"),
  },
  {
    path: "/wallet",
    name: "Wallet",
    component: () =>
      import(/* webpackChunkName: "wallet" */ "../views/Wallet.vue"),
  },
  {
    path: "/pool",
    name: "Pool",
    component: () =>
      import(/* webpackChunkName: "wallet" */ "../views/Pool.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
