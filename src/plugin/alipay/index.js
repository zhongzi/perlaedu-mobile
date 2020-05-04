import alipay from "./alipay";

export default {
  install(Vue) {
    Vue.prototype.$alipay = alipay;
    Vue.$alipay = alipay;
  },
  $alipay: alipay,
};
