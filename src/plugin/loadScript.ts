import Vue from "vue";

const loadScript = (url, callback = null, type = "js") => {
  let dom = null;
  if (type === "js") {
    dom = document.createElement("script");
    dom.setAttribute("type", "text/javascript");
    dom.setAttribute("charset", "utf-8");
    dom.setAttribute("src", url);
  } else if (type === "css") {
    dom = document.createElement("link");
    dom.setAttribute("rel", "stylesheet");
    dom.setAttribute("type", "text/css");
    dom.setAttribute("href", url);
  }
  if (dom) {
    document.head.appendChild(dom);
    dom.onload = () => {
      callback && callback();
    };
  }
};

export default function (pVue: typeof Vue, options = {}) {
  pVue.prototype.$loadScript = loadScript;
}
