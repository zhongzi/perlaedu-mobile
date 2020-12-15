import Vue from "vue";

const uuidv4 = require("uuid/v4");
const configs = require("../configs.json");

const captcha = {
  build() {
    const key = uuidv4();
    const url = configs.captchaURL + "?captcha_key=" + key;
    return { key, url };
  },
};

export default function (pVue: typeof Vue, options = {}) {
  pVue.prototype.$captcha = captcha;
}
