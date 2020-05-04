export default {
  isInAlipay() {
    return /alipayclient/.test(window.navigator.userAgent.toLowerCase());
  },
  ready(callback) {
    if (!this.isInAlipay()) {
      return;
    }
    if (window.AlipayJSBridge) {
      callback && callback();
    } else {
      document.addEventListener("AlipayJSBridgeReady", callback, false);
    }
  },
  toast(config, callback) {
    this.ready(() => {
      window.AlipayJSBridge.call("toast", config, callback);
    });
  },
  tradePay(tradeNO, callback) {
    this.ready((tradeNo) => {
      window.AlipayJSBridge.call(
        "tradePay",
        {
          tradeNO: tradeNO,
        },
        (result) => {
          callback && callback(result);
        }
      );
    });
  },
};
