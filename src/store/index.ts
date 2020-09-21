import Vue from "vue";
import Vuex from "vuex";
import createLogger from "vuex/dist/logger";

import modules from "./modules";

const configs = require("../configs.json");

Vue.use(Vuex);

function getFullTitle(title) {
  const siteName = configs.siteName;
  if (siteName && siteName.length > 0) {
    title = title + " - " + siteName;
  }
  if (!title || title.length === 0) {
    return "AI教务";
  }
  return title;
}

const state = {
  title: "",
  routerEntering: false,
  version: "1.0 (" + (process.env.VUE_APP_REVISION || "dev") + ")",
  pendingRoute: false,
  pendingTelephone: "",
  user: {},
  expose: "",
  expose2: "",
  routes: [],
};

const getters = {
  isVerifyVisible(state) {
    return Boolean(state.pendingRoute);
  },
  fullTitle(state) {
    return getFullTitle(state.title);
  },
};

const mutations = {
  deepSet(state, { object, key, value }) {
    Vue.set(object, key, value);
  },
  updateTitle(state, title) {
    if (!title) {
      title = "";
    }
    state.title = title;
    if (window.document) {
      window.document.title = getFullTitle(title);
    }
  },
  updateVersion(state, version) {
    state.version = version;
  },
  updateUser(state, user) {
    state.user = user;
  },
  beforeRouteEnter(state, { to, from }) {
    state.routerEntering = true;
  },
  afterRouterEnter(state, { to, from }) {
    state.routerEntering = false;
    state.routes.push(to);
    if (to.query.expose) {
      state.expose = to.query.expose;
    }
    if (to.query.expose2) {
      state.expose2 = to.query.expose2;
    }
  },
};

const actions = {};

const debug = process.env.NODE_ENV !== "production";
export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions,
  modules,
  strict: debug,
});
