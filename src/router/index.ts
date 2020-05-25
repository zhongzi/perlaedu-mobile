import Vue from "vue";
import Router from "vue-router";
import patchVueRouter from "@jukejia/egret-utils/dist/patch/vue-router";

const FlashTrade = () =>
  import(/* webpackChunkName: "main" */ "@/view/FlashTrade.vue");

const Contact = () =>
  import(/* webpackChunkName: "main" */ "@/view/Contact.vue");

const Subscription = () =>
  import(/* webpackChunkName: "main" */ "@/view/Subscription.vue");

const NotFound = () =>
  import(/* webpackChunkName: "main" */ "@/view/NotFound.vue");

import billRoutes from "./bill";
import termsOfServiceRoutes from "./terms_of_service";

patchVueRouter(Router);
Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      redirect: {
        name: "billHome",
      },
      meta: {
        requireOpenid: true,
        requireAuth: true,
      },
    },
    {
      path: "/flash-trade",
      name: "FlashTrade",
      component: FlashTrade,
      meta: {
        requireOpenid: true,
        requireAuth: true,
        pathname: "/lotteries/",
        title: "收银台",
      },
    },
    {
      path: "/contact",
      name: "Contact",
      component: Contact,
      meta: {
        requireOpenid: true,
        title: "联系我们",
        style: {
          backgroundColor: "#fff",
        },
      },
    },
    {
      path: "/subscription",
      name: "Subscription",
      component: Subscription,
      meta: {
        requireOpenid: true,
        title: "关注公众号",
        copyrightStyle: {
          color: "#fff",
          background: "linear-gradient(123deg, #ffa118 0%, #ff8306 100%)",
        },
      },
    },
    {
      path: "*",
      name: "NotFound",
      component: NotFound,
      meta: {
        title: "404",
      },
    },
  ].concat(billRoutes, termsOfServiceRoutes),
  scrollBehavior: (to, from, savedPosition) => {
    if (savedPosition) {
      return savedPosition;
    }
    return { x: 0, y: 0 };
  },
});
