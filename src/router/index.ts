import Vue from "vue";
import Router from "vue-router";
import patchVueRouter from "@jukejia/egret-utils/dist/patch/vue-router";

const FlashTrade = () =>
  import(/* webpackChunkName: "main" */ "@/view/FlashTrade.vue");

const Contact = () =>
  import(/* webpackChunkName: "main" */ "@/view/Contact.vue");

const Register = () =>
  import(/* webpackChunkName: "main" */ "@/view/Register.vue");

const Subscription = () =>
  import(/* webpackChunkName: "main" */ "@/view/Subscription.vue");

const NotFound = () =>
  import(/* webpackChunkName: "main" */ "@/view/NotFound.vue");

const Locking = () =>
  import(/* webpackChunkName: "main" */ "@/view/Locking.vue");

const PhoneVerifying = () =>
  import(/* webpackChunkName: "main" */ "@/view/PhoneVerifying.vue");

import billRoutes from "./bill";
import websiteRoutes from "./website";
import userRoutes from "./user";
import crmRoutes from "./crm";
import posterRoutes from "./poster";
import merchantRoutes from "./merchant";
import mediaRoutes from "./media";
import noticeRoutes from "./notice";
import termsOfServiceRoutes from "./terms_of_service";

patchVueRouter(Router);
console.log(Router);
Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      redirect: {
        name: "student",
      },
      meta: {
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
        pathname: "/campaigns/",
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
      path: "/register",
      name: "Register",
      component: Register,
      meta: {
        title: "马上开通",
        hideCopyright: true,
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
      path: "/locking",
      name: "Locking",
      component: Locking,
      meta: {
        title: "操作失败",
      },
    },
    {
      path: "/phone-verifying",
      name: "PhoneVerifying",
      component: PhoneVerifying,
      meta: {
        title: "手机号码绑定",
        requireAuth: true,
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
  ].concat(
    billRoutes,
    termsOfServiceRoutes,
    websiteRoutes,
    userRoutes,
    crmRoutes,
    posterRoutes,
    merchantRoutes,
    mediaRoutes,
    noticeRoutes
  ),
  scrollBehavior: (to, from, savedPosition) => {
    if (savedPosition) {
      return savedPosition;
    }
    return { x: 0, y: 0 };
  },
});
