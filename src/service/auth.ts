import isEmpty from "lodash/isEmpty";
import isObject from "lodash/isObject";
import store from "../store";

const configs = require("../configs.json");

const auth: any = {
  loggedIn() {
    return true;
  },
  gotoLogin() {
    location.href =
      configs.apiPrefix +
      "/wechat/login?next=" +
      encodeURIComponent(location.href);
  },
  login({ user, openid, token }) {
    if (token) {
      this.token = token;
    }
    if (openid) {
      this.openid = openid;
    }
    if (user) {
      this.user = user;
      this.openid = user.openid;

      store.commit("updateUser", user);
    }
  },
  logout() {
    this.user = {};
    this.token = "";
    this.openid = "";

    store.commit("updateUser", null);
  },
  hasLoggedUser() {
    return this.user && this.user.id;
  },
  hasOpenId() {
    return this.openid && this.openid.length > 0;
  },
  replaceExpose(next, to, store) {
    const oldExpose: string | void = to.query.expose;
    const oldExpose2: string | void = to.query.expose2;

    if (oldExpose && oldExpose === this.openid) {
      return false;
    }

    to.query.expose = this.openid;
    if (oldExpose) {
      to.query.expose2 = oldExpose;
    } else {
      to.query.expose2 = oldExpose2 || store.state.expose2;
    }

    next({
      name: to.name,
      params: to.params,
      query: to.query,
    });
    return true;
  },
};

const _jsonCaches = {};

function getJson(key, default_ = {}) {
  const raw = window.localStorage.getItem(key);

  const cache = _jsonCaches[key];
  if (cache) {
    const oldRaw = cache[0];
    if (raw === oldRaw) {
      return cache[1];
    }
  }

  let json = null;
  try {
    json = JSON.parse(raw);
  } catch (e) {
    console.log(e);
  }
  json = json || default_;

  _jsonCaches[key] = [raw, json];

  return json;
}

function defineJSONProperty(name) {
  Object.defineProperty(auth, name, {
    set: function (value) {
      if (value) {
        window.localStorage.setItem(name, JSON.stringify(value));
      } else {
        window.localStorage.removeItem(name);
      }
    },
    get: function () {
      return getJson(name);
    },
  });
}

function defineStringProperty(name) {
  Object.defineProperty(auth, name, {
    set: function (value) {
      if (value) {
        window.localStorage.setItem(name, value);
      } else {
        window.localStorage.removeItem(name);
      }
    },
    get: function () {
      return window.localStorage.getItem(name) || "";
    },
  });
}

defineStringProperty("token");
defineStringProperty("entry");
defineJSONProperty("bill");

export default auth;
