import weixin from "./weixin";

const setupGetGeoLocation = (weixin) => {
  if (weixin.isInWeixin()) {
    navigator.geolocation.getCurrentPosition = (success, error, options) => {
      weixin.config(() => {
        weixin.api.getLocation({
          type: (options && options.gpsType) || "wgs84",
          success: function (res) {
            success({ coords: res });
          },
          fail: error,
        });
      }, false);
    };
  }
};

export default {
  install(Vue) {
    setupGetGeoLocation(weixin);

    Vue.prototype.$weixin = weixin;
    Vue.$weixin = weixin;
  },
  $weixin: weixin,
};
