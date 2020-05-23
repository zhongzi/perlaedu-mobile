import Vue from "vue";
import pickBy from "lodash/pickBy";
import isEmpty from "lodash/isEmpty";
import get from "lodash/get";

const configs = require("@/configs.json");
const urljoin = require("url-join");
const isProduction = process.env.NODE_ENV === "production";

const tools = {
  isEmpty: (val) => isEmpty(val),
  queryFilter: (d) => pickBy(d, (val) => val !== undefined),
  shadowLink: (
    link: string = null,
    campaign: any = null,
    pathname: string = null
  ) => {
    link = link || location.href;
    if (!isProduction || (!campaign && !pathname)) return link;

    const url = new URL(link);
    if (!pathname) {
      const prefix: string = configs.campaignPrefix || "/zhaosheng";
      const code: string = get(
        campaign,
        "template.code",
        "Standard"
      ).toLowerCase();
      const id: number = get(campaign, "id", 0);
      pathname = urljoin(prefix, code, id.toString(), "/");
    }
    url.pathname = pathname;
    return url.href;
  },
  resolveQrcode: (url) => {
    return (
      configs.qrcodeURL +
      "?next=" +
      encodeURIComponent(url || window.location.href)
    );
  },
  resolveURL: (router, location) => {
    const resolved = router.resolve(location);
    const url = tools.buildURL(resolved.route.fullPath);
    return url;
  },
  buildURL: (path) => {
    return [location.origin, location.pathname, "#", path].join("");
  },
  image2DataURI: (img) => {
    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    return canvas.toDataURL("image/png");
  },
  downloadURI: (dataURI, name) => {
    const link = document.createElement("a");
    link.download = name;
    link.href = dataURI;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },
  px2viewport: (value: number, type: string = "vw") => {
    const viewportWidth = 375;
    return (100 * value) / viewportWidth + type;
  },
};

export { tools };
export default function (pVue: typeof Vue, options = {}) {
  pVue.prototype.$tools = tools;
}
