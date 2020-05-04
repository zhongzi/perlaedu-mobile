import Vue from "vue";
import { apiV1 } from "@/api/api";
import auth from "@/service/auth";

let weixin = require("weixin-js-sdk");

let shareMenus = [
  "menuItem:share:appMessage",
  "menuItem:share:timeline",
  "menuItem:share:qq",
  "menuItem:share:weiboApp",
  "menuItem:share:facebook",
  "menuItem:share:QZone",
];

export default {
  jsapi: weixin,
  isConfigured: false,
  isIOS() {
    return /iphone|ipod|ios|ipad/.test(
      window.navigator.userAgent.toLowerCase()
    );
  },
  isInWeixin() {
    if (!weixin) {
      return false;
    }
    return /micromessenger/.test(window.navigator.userAgent.toLowerCase());
  },
  ready(callback) {
    if (!this.isInWeixin()) {
      return;
    }
    if (window.WeixinJSBridge) {
      callback && callback();
    } else {
      document.addEventListener("WeixinJSBridgeReady", callback, false);
    }
  },
  tradePay({ payInfo, success, fail, cancel }) {
    this.ready(() => {
      window.WeixinJSBridge.invoke("getBrandWCPayRequest", payInfo, (res) => {
        if (res.err_msg === "get_brand_wcpay_request:ok") {
          success && success(res);
        } else if (res.err_msg === "get_brand_wcpay_request:fail") {
          fail && fail(res);
        } else if (res.err_msg === "get_brand_wcpay_request:cancel") {
          cancel && cancel(res);
        }
      });
    });
  },
  getNetworkType(callback) {
    this.ready(() => {
      window.WeixinJSBridge.invoke("getNetworkType", {}, (res) => {
        callback && callback();
      });
    });
  },
  config(callback) {
    var url = window.location.href;
    if (this.isIOS()) {
      url = auth.entry;
    } else {
      this.isConfigured = false;
    }

    weixin.ready(() => {
      callback && callback();
    });

    weixin.error((res) => {
      console.log("[Weixin]error " + JSON.stringify(res));
    });

    if (this.isConfigured) {
      return;
    }

    apiV1.post("jsapi_signature", { url: url }).then((response) => {
      response = response.data;
      var config = {
        debug: process.env.NODE_ENV !== "production",
        appId: response.appid,
        timestamp: response.timestamp,
        nonceStr: response.noncestr,
        signature: response.signature,
        jsApiList: [
          "onMenuShareTimeline",
          "onMenuShareAppMessage",
          "onMenuShareQQ",
          "onMenuShareWeibo",
          "onMenuShareQZone",
          "showMenuItems",
          "hideMenuItems",
          "chooseImage",
          "uploadImage",
          "previewImage",
          "chooseWXPay",
          "getLocation",
          "openLocation",
          "startRecord",
          "stopRecord",
          "onVoiceRecordEnd",
          "playVoice",
          "pauseVoice",
          "stopVoice",
          "onVoicePlayEnd",
          "uploadVoice",
        ],
      };
      weixin.config(config);
      this.isConfigured = true;
    });
  },
  disableShare() {
    if (!this.isInWeixin()) {
      return;
    }
    weixin.hideMenuItems({
      menuList: shareMenus,
    });
  },
  enableShare() {
    if (!this.isInWeixin()) {
      return;
    }
    weixin.showMenuItems({
      menuList: shareMenus,
    });
  },
  configShare(config) {
    if (!this.isInWeixin()) {
      return;
    }

    weixin.onMenuShareTimeline(config);
    weixin.onMenuShareAppMessage(config);
    weixin.onMenuShareQQ(config);
    weixin.onMenuShareWeibo(config);
    weixin.onMenuShareQZone(config);
    this.enableShare();
  },
  clearShare() {
    this.configShare({});
  },
  close() {
    if (!this.isInWeixin()) {
      return;
    }
    weixin.closeWindow();
  },
};
