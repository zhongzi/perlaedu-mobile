import Vue from "vue";

import notifyApi from "@/api/common/notify";
import filters from "@/filter";

const wework = {
  notify: (data) => {
    return notifyApi.create({
      res: data,
      query: null,
      headers: null,
      args: null,
    });
  },

  notifyForNewWebsite: (nickname, openid, telephone, merchant, fromOpenid) => {
    const channel = "门户服务";
    const title = "有人领取了门户网站30天";
    const curTime = filters.date(new Date(), "yyyy-MM-dd HH:mm:ss");

    const data = {
      msgtype: "markdown",
      markdown: {
        content:
          `**「${channel}」<font color="warning">${title}</font>了** \n` +
          `>领取手机号码: <font color="comment">${telephone}</font> \n` +
          `>领取用户微信: <font color="comment">${nickname}</font> \n` +
          `>领取用户openid: <font color="comment">${openid}</font> \n` +
          `>领取时间: <font color="comment">${curTime}</font> \n` +
          `>推荐用户openid: <font color="comment">${
            fromOpenid || "无"
          }</font> \n` +
          `>请及时联系\n`,
      },
    };
    return wework.notify(JSON.stringify(data));
  },
};

export { wework };
export default function (pVue: typeof Vue, options = {}) {
  pVue.prototype.$wework = wework;
}
