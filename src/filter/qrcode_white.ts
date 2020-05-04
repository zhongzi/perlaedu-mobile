import watermark from "@jukejia/egret-utils/dist/filters/watermark";
const background = "https://cdn.17fenlei.cn/static/qrcode_white.png";

export default function (url: string): string {
  return watermark(background, url, {
    gravity: "Center",
  });
}
