import "./class-component-hooks";

import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./registerServiceWorker";

import Hui from "@zhongzi/hui";
import "@zhongzi/hui/dist/styles/hui.css";

import * as Sentry from "@sentry/browser";
import * as Integrations from "@sentry/integrations";

import VueBemCn from "vue-bem-cn";
import VueCookies from "vue-cookies";

import auth from "./service/auth";
import plugins from "./plugin";
import filters from "./filter";
import directives from "./directive";
import { tools } from "./plugin/tools";
import "./api/login";
import { loadDictionary } from "./plugin/configs";

import isEmpty from "lodash/isEmpty";
import isObject from "lodash/isObject";
import isString from "lodash/isString";
import _get from "lodash/get";

Vue.use(Hui);
Vue.use(VueBemCn);
Vue.use(VueCookies);

const configs = require("./configs.json");
const isProduction = process.env.NODE_ENV === "production";

// plugins
plugins.forEach(function (plugin) {
  Vue.use(plugin);
});

// filters
for (const key in filters) {
  Vue.filter(key, filters[key]);
}

// directives
for (const key in directives) {
  Vue.directive(key, directives[key]);
}

// bem 插件
Vue.use(VueBemCn, {
  hyphenate: true,
  delimiters: {
    ns: "",
    el: "__",
    mod: "_",
    modVal: "-",
  },
});

// 配置
// Sentry config
isProduction &&
  Sentry.init({
    dsn: configs.dsn,
    integrations: [new Integrations.Vue({ Vue, attachProps: true })],
  });

// 路由守卫
function confirmNext(next: any, from: any, to: any) {
  store.commit("updateTitle", to.meta ? to.meta.title : "");
  next();
}

function pathnameRequired(to: any) {
  const link: string = tools.buildURL(to.fullPath);
  const url: any = new URL(link);
  let pathname = null;
  to.matched.forEach((record) => {
    if (record.meta.pathname) pathname = record.meta.pathname;
  });

  if (!pathname || pathname === url.pathname) {
    return false;
  }

  window.location.replace(tools.shadowLink(link, null, pathname));
  return true;
}

router.beforeEach((to: any, from: any, next: any) => {
  store.commit("beforeRouteEnter", { to, from });

  // pathname守卫
  if (
    isProduction &&
    to.matched.some((record: any) => {
      return record.meta.pathname;
    })
  ) {
    if (pathnameRequired(to)) {
      next(false);
      return;
    }
  }

  if (!isEmpty(to.query.token)) {
    auth.login({ token: to.query.token });
  }

  let needOpenid = false;
  let needAuth = false;
  if (
    to.matched.some((record: any) => {
      return record.meta.requireOpenid === true;
    })
  ) {
    if (!auth.hasOpenId()) {
      auth.fetchOpenid(next, to);
      return;
    }
    needOpenid = true;
  }

  if (
    to.matched.some((record: any) => {
      return record.meta.requireAuth === true;
    })
  ) {
    if (!auth.hasLoggedUser()) {
      return auth.fetchLoggedUser(next, to);
    }
    needAuth = true;
  }
  if (needOpenid || needAuth) {
    if (auth.replaceExpose(next, to, store)) {
      return false;
    }
  }

  // 角色要求检查
  if (to.meta.requireManager !== false) {
    if (
      to.matched.some((record: any) => {
        return record.meta.requireManager === true;
      })
    ) {
      if (!_get(auth, "user.is_manager", false)) {
        next({
          name: "Locking",
          query: to.query,
        });
        return;
      }
    }
  }

  confirmNext(next, from, to);
});

router.afterEach((to: any, from: any) => {
  store.commit("afterRouterEnter", { to, from });
});

const replaceExpose = (location) => {
  if (isEmpty(location)) return;

  const curQuery = (router.currentRoute
    ? router.currentRoute.query
    : {}) as any;
  if (isObject(location)) {
    location = location as any;
    const query = location.query || ({} as any);
    location.query = Object.assign({}, query || {}, {
      expose: query.expose || curQuery.expose || "",
      expose2: query.expose2 || curQuery.expose2 || "",
    });
  }

  if (isString(location)) {
    const hasQuery = location.indexOf("?");
    location += hasQuery >= 0 ? "&" : "?";
    if (location.indexOf("expose") < 0) {
      location += "&expose=" + curQuery.expose || "";
    }
    if (location.indexOf("expose2") < 0) {
      location += "&expose2=" + curQuery.expose2 || "";
    }
  }
  return location;
};
const originalReplace = router.replace;
router.replace = function (location, onResolve, onReject) {
  location = replaceExpose(location);
  if (onResolve || onReject) {
    return originalReplace.call(this, location, onResolve, onReject);
  }
  return originalReplace.call(this, location).catch((err) => {
    console.log(err);
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
const originalPush = router.push;
router.push = function (location, onResolve, onReject) {
  location = replaceExpose(location);
  if (onResolve || onReject) {
    return originalPush.call(this, location, onResolve, onReject);
  }
  return originalPush.call(this, location).catch((err) => {
    console.log(err);
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

// 预加载配置
loadDictionary(() => {
  new Vue({
    router,
    store,
    render: (h) => h(App),
  }).$mount("#app");
  return;
});
