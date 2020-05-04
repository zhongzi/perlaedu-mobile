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

    let url = new URL(link);
    if (!pathname) {
      let prefix: string = configs.campaignPrefix || "/zhaosheng";
      let code: string = get(
        campaign,
        "template.code",
        "Standard"
      ).toLowerCase();
      let id: number = get(campaign, "id", 0);
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
    let resolved = router.resolve(location);
    let url = tools.buildURL(resolved.route.fullPath);
    return url;
  },
  buildURL: (path) => {
    return [location.origin, location.pathname, "#", path].join("");
  },
  image2DataURI: (img) => {
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    return canvas.toDataURL("image/png");
  },
  downloadURI: (dataURI, name) => {
    var link = document.createElement("a");
    link.download = name;
    link.href = dataURI;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },
  px2viewport: (value: number, type: string = "vw") => {
    let viewportWidth = 375;
    return (100 * value) / viewportWidth + type;
  },
};

export { tools };
export default function (pVue: typeof Vue, options = {}) {
  pVue.prototype.$tools = tools;
}
