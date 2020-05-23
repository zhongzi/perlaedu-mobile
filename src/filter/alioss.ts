import isEmpty from "lodash/isEmpty";

export default function (
  url: string,
  option: {
    width?: number;
    height?: number;
    mode?: string;
    large?: string | number;
    short?: string | number;
    limit?: string | number;
    color?: string;
    dppx?: number;
  } = {}
): string {
  if (isEmpty(url)) {
    return "";
  }

  const wx = undefined;
  let systemDppx = 1;
  if (typeof wx !== "undefined" && wx.getSystemInfoSync) {
    const systemInfo = wx.getSystemInfoSync();
    systemDppx = systemInfo.pixelRatio;
  } else {
    const res = require("res");
    systemDppx = res.dppx() || 1;
  }

  const dppx = option.dppx || systemDppx;

  let ossParams: string = "x-oss-process=image/resize";

  option.mode = option.mode || "lfit";
  ossParams += `,m_${option.mode}`;

  option.width = option.width || document.body.clientWidth;

  if (option.width) {
    ossParams += `,w_${Math.ceil(option.width * dppx)}`;
  }
  if (option.height) {
    ossParams += `,h_${Math.ceil(option.height * dppx)}`;
  }
  if (option.large) {
    ossParams += `,l_${option.large}`;
  }
  if (option.short) {
    ossParams += `,s_${option.short}`;
  }
  if (option.color) {
    ossParams += `,color_${option.color}`;
  }

  option.limit = option.limit || 0;
  ossParams += `,limit_${option.limit}`;

  if (url.indexOf("?") >= 0) {
    url += `&${ossParams}`;
  } else {
    url += `?${ossParams}`;
  }
  return url;
}
