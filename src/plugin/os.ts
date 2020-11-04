import Vue from "vue";

// TODO 补充

const client: any = {
  mobile: {
    isAndroid: false,
    isIPhone: false,
    isIOS: false,
    isSymbian: false,
  },
  browser: {
    isChrome: false,
    isIE: false,
    isEdge: false,
    isSafari: false,
    isFireFox: false,
    isMicromessenger: false,
  },
  isInWeixin: false,
  os: {
    isWin32: false,
    isMacIntel: false,
    isFreeBSD: false,
    isWebTV: false,
  },
};

export default function (pVue: typeof Vue, options = {}) {
  pVue.prototype.$client = client;
}
