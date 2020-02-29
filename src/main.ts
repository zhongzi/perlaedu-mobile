import "./class-component-hooks";

import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./registerServiceWorker";

import * as Sentry from "@sentry/browser";
import * as Integrations from "@sentry/integrations";

import VueBemCn from "vue-bem-cn";
import VueCookies from "vue-cookies";

import auth from "./service/auth";
import plugins from "./plugin";
import filters from "./filter";

Vue.use(VueBemCn);
Vue.use(VueCookies);

const configs = require("./configs.json");

// plugins
plugins.forEach(function(plugin) {
  Vue.use(plugin);
});

// filters
for (const key in filters) {
  Vue.filter(key, filters[key]);
}

// bem 插件
Vue.use(VueBemCn, {
  hyphenate: true,
  delimiters: {
    ns: "",
    el: "__",
    mod: "_",
    modVal: "-"
  }
});

// 配置
// Sentry config
if (process.env.NODE_ENV !== "development") {
  Sentry.init({
    dsn: configs.dsn,
    integrations: [new Integrations.Vue({ Vue, attachProps: true })]
  });
}

// 路由守卫
function confirmNext(next: any, from: any, to: any) {
  store.commit("updateTitle", to.meta ? to.meta.title : "");
  next();
  // auth.replaceExpose(next, to, store);
}

router.beforeEach((to: any, from: any, next: any) => {
  store.commit("beforeRouteEnter", { to, from });

  if (
    to.matched.some((record: any) => {
      return record.meta.requireOpenid === true;
    })
  ) {
    if (!auth.hasOpenId()) {
      auth.fetchOpenid(next, to);
      return;
    }
  }

  if (
    to.matched.some((record: any) => {
      return record.meta.requireAuth === true;
    })
  ) {
    if (!auth.hasLoggedUser()) {
      return auth.fetchLoggedUser(next, to);
    }
  }
  confirmNext(next, from, to);
});

router.afterEach((to: any, from: any) => {
  store.commit("afterRouterEnter", { to, from });
});

const originalPush = router.push;
router.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) {
    return originalPush.call(this, location, onResolve, onReject);
  }
  return originalPush.call(this, location).catch(err => {
    if (err) {
      // If there really is an error, throw it
      // Should probably be more sophisticated based on the type of err
      return Promise.reject(err);
    }
    // Otherwise resolve to false to indicate the original push call didn't go to its original
    // destination.
    // TODO: return the final route instead of false?
    return Promise.resolve(false);
  });
} as any;

Vue.config.productionTip = false;
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
