const configs = require("@/configs.json");

export default function (url: string): string {
  return configs.qrcodeURL + "?next=" + encodeURIComponent(url);
}
