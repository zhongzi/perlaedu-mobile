import Vue from "vue";

import dictionaryApi from "@/api/core/dictionary";

import cloneDeep from "lodash/cloneDeep";
import forEach from "lodash/forEach";

const configs = cloneDeep(require("../configs.json"));

// 加载预设配置项
const keys = ["guaranteeBillURL", "guaranteeBillWithdrawURL"];

const loadDictionary = (callback) => {
  dictionaryApi
    .list({
      query: {
        key: keys,
      },
      headers: {},
      args: {},
    })
    .then((resp) => {
      forEach(resp.data.data, (dic) => {
        configs[dic.key] = dic.value;
      });
      callback && callback();
    })
    .catch((e) => {
      console.log(e);
    });
};

export default function (pVue: typeof Vue, options = {}) {
  pVue.prototype.$configs = configs;
}

export { loadDictionary };
