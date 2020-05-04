import Vue from "vue";

const configs = require("../configs.json");
export default function (pVue: typeof Vue, options = {}) {
  pVue.prototype.$configs = configs;
}
