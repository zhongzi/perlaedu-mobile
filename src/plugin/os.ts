import Vue from "vue";

const ua = navigator.userAgent.toLowerCase();

const isWin = /(win32|windows)/i.test(ua);
const isMac = /(mac68k|macppc|macintosh|macintel)/i.test(ua);
const isLinux = /(linux)/i.test(ua);

const isPC = isWin || isMac || isLinux;
const isWebTV = /(webtv)/i.test(ua);
const isMobile = !(isPC || isWebTV);

const client: any = {
  device: {
    isMobile: isMobile,
    isPC: isPC,
    isWebTV: isWebTV,
  },
  mobile: {
    isAndroid: /(android)/i.test(ua),
    isIPhone: /(iphone)/i.test(ua),
    isIPad: /(ipad)/i.test(ua),
    isSymbian: /(symbian)/i.test(ua),
  },
  pc: {
    isWin: isWin,
    isMac: isMac,
    isLinux: isLinux,
  },
  browser: {
    isChrome: /(chrome)/i.test(ua),
    isIE: /(msie)/i.test(ua),
    isEdge: /(edge)/i.test(ua),
    isSafari: /(safari)/i.test(ua),
    isFireFox: /(firefox)/i.test(ua),
    isMicromessenger: /(micromessenger|wxwork)/i.test(ua),
  },
};

export default function (pVue: typeof Vue, options = {}) {
  pVue.prototype.$client = client;
}
