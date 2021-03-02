import isEmpty from "lodash/isEmpty";
import forEach from "lodash/forEach";
import { Base64 } from "js-base64";

// 判断是否支持webp
let supportedWebp = false;
function check_webp_feature(feature, callback) {
  const kTestImages = {
    lossy: "UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA",
    lossless: "UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA==",
    alpha:
      "UklGRkoAAABXRUJQVlA4WAoAAAAQAAAAAAAAAAAAQUxQSAwAAAARBxAR/Q9ERP8DAABWUDggGAAAABQBAJ0BKgEAAQAAAP4AAA3AAP7mtQAAAA==",
    animation:
      "UklGRlIAAABXRUJQVlA4WAoAAAASAAAAAAAAAAAAQU5JTQYAAAD/////AABBTk1GJgAAAAAAAAAAAAAAAAAAAGQAAABWUDhMDQAAAC8AAAAQBxAREYiI/gcA",
  };
  const img = new Image();
  img.onload = function () {
    const result = img.width > 0 && img.height > 0;
    callback(feature, result);
  };
  img.onerror = function () {
    callback(feature, false);
  };
  img.src = "data:image/webp;base64," + kTestImages[feature];
}
check_webp_feature("lossy", (f, r) => {
  supportedWebp = r;
});

// 图片格式检测
function check_image_mimes(url, mimes = ["gif"]) {
  url = new URL(url);
  const re = /(?:\.([^.]+))?$/;
  const ext = re.exec(url.pathname)[1] || "";
  return mimes.indexOf(ext.toLowerCase()) >= 0;
}

function removeParams(url, ps = []) {
  if (isEmpty(url) || isEmpty(ps) || url.indexOf("?") < 0) return url;

  const parts = url.split("?");
  const params = new URLSearchParams(parts[1]);
  forEach(ps, (p) => {
    params.delete(p);
  });
  return parts[0] + "?" + params.toString();
}

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
    w_type?: string;
    w_size?: number;
    w_text?: string;
    w_color?: string;
    w_fill?: number;
    w_g?: string;
    w_p?: number;
    w_x?: number;
    w_y?: number;
    w_t?: number;
    w_shadow?: number;
    w_rotate?: number;
    dppx?: number;
  } = {}
): string {
  url = removeParams(url, ["x-oss-process"]);
  if (isEmpty(url)) {
    return null;
  }

  if (!url.startsWith("http")) {
    return url;
  }

  if (check_image_mimes(url)) {
    return url;
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
  let ossParams: string = "x-oss-process=image";

  if (option.width || option.height) {
    ossParams += "/resize";

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

    option.limit = option.limit || 1;
    ossParams += `,limit_${option.limit}`;
  }

  if (option.w_text) {
    const scale = option.width ? option.width / 150 : 1;

    ossParams += "/watermark";
    ossParams += `,text_${Base64.encode("@ " + option.w_text)
      .replace(/\//g, "_")
      .replace("/+/g", "-")}`;

    option.w_type = option.w_type || "d3F5LW1pY3JvaGVp";
    ossParams += `,type_${option.w_type}`;

    option.w_color = option.w_color || "FFFFFF";
    ossParams += `,color_${option.w_color}`;

    option.w_size = scale * 15;
    ossParams += `,size_${option.w_size}`;

    option.w_shadow = option.w_shadow || 50;
    ossParams += `,shadow_${option.w_shadow}`;

    option.w_t = option.w_t || 100;
    ossParams += `,t_${option.w_t}`;

    option.w_fill = option.w_fill || 0;
    ossParams += `,fill_${option.w_fill}`;

    option.w_g = option.w_g || "se";
    ossParams += `,g_${option.w_g}`;

    option.w_p = option.w_p || 100;
    ossParams += `,p_${option.w_p}`;

    option.w_x = scale * 10;
    ossParams += `,x_${option.w_x}`;

    option.w_y = scale * 10;
    ossParams += `,y_${option.w_y}`;
  }

  ossParams += "/format," + (supportedWebp ? "webp" : "jpg");

  if (url.indexOf("?") >= 0) {
    url += `&${ossParams}`;
  } else {
    url += `?${ossParams}`;
  }
  return url;
}
