import Vue from "vue";

import * as ls from "local-storage";

import getKeys from "lodash/keys";
import forIn from "lodash/forIn";

// 根据需要自行扩充
class Storage {
  nsSet(
    ns,
    key,
    value,
    compKey = "date",
    isReservedFromTop = true,
    limit = 20
  ) {
    const nsVal = ls.get(ns) || {};

    const keys = getKeys(nsVal) || [];
    let curCompVal = null;
    let curCompKey = null;
    if (!keys.includes(key) && keys.length >= limit) {
      forIn(nsVal, (v, k) => {
        v = v[compKey];
        const isPass = isReservedFromTop ? curCompVal < v : curCompVal > v;
        if (v && (!curCompVal || !isPass)) {
          curCompVal = v;
          curCompKey = k;
        }
      });
    }

    if (curCompKey) {
      delete ns[curCompKey];
    }

    nsVal[key] = value;
    ls.set(ns, nsVal);
  }

  nsGet(ns, key = null, default_ = null) {
    return (key ? ls.get(ns)[key] : ls.get(ns)) || default_;
  }
}

export default function (pVue: typeof Vue, options = {}) {
  pVue.prototype.$db = new Storage();
}
