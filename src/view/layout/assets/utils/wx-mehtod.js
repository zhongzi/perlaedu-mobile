// import wx from 'weixin-jsapi'
import wx from "weixin-jsapi";

const mpNavigateTo = (url) => {
  console.log("mpNavigateTo", url);
  wx.miniProgram.switchTab({
    url: "/pages/market/index",
  });
};

export default {
  mpNavigateTo,
};
