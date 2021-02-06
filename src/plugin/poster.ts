import Vue from "vue";
import Konva from "konva";

import _get from "lodash/get";
import find from "lodash/find";
import debounce from "lodash/debounce";
import isArray from "lodash/isArray";
import values from "lodash/values";
import cloneDeep from "lodash/cloneDeep";
import forEach from "lodash/forEach";

const configs = cloneDeep(require("../configs.json"));

class PosterBuilder {
  id: any = null;
  name: any = null;
  baseWidth: any = null;
  baseHeight: any = null;
  baseColor: any = null;
  scale: any = null;
  template: any = null;
  elements: any = null;
  callback: any = null;
  stage: any = null;
  layer: any = null;

  initKonva: any = null;
  build: any = null;

  constructor(
    id = null,
    name = null,
    template = null,
    elements = null,
    baseWidth = null,
    baseHeight = null,
    callback = null
  ) {
    this.id &&
      this.setData(
        id,
        baseWidth,
        baseHeight,
        name,
        template,
        elements,
        callback
      );
  }

  setData(
    id,
    name,
    template,
    elements,
    baseWidth,
    baseHeight,
    callback = null
  ) {
    this.id = id;
    this.scale = 1;
    this.name = name;
    this.template = template;
    this.elements = isArray(elements) ? elements : values(elements);
    this.baseWidth = baseWidth;
    this.baseHeight = baseHeight;
    this.callback = callback;

    this.initKonva = debounce(() => {}, 1000);

    this.build = debounce(() => {
      this._build();
    }, 1000);
  }
  _initKonva() {
    if (this.layer) {
      this.layer.destroyChildren();
      this.layer.clear();
      this.layer.clearCache();
    }
    if (this.stage) {
      this.stage.destroyChildren();
      this.stage.clear();
      this.stage.clearCache();
    }
    this.stage = new Konva.Stage({ container: this.id });
    this.layer = new Konva.Layer();
    this.stage.add(this.layer);
    this.stage.width(this.baseWidth);
    this.stage.height(this.baseHeight);
  }

  getURL() {
    return this.stage.getStage().toDataURL();
  }

  proxyURL(originURL) {
    try {
      const url = new URL(originURL);
      return `${configs.proxy}/${url.host}${url.pathname}${url.search}${url.hash}`;
    } catch (error) {
      console.log(error);
    }
    return originURL;
  }

  downloadURL() {
    const link = document.createElement("a");
    link.download = this.name;
    link.href = this.getURL();
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  _build() {
    this._initKonva();
    this.buildTemplate((image) => {
      if (image) {
        if (this.baseWidth) {
          this.scale = image.width / this.baseWidth;
        }
        this.stage.width(image.width);
        this.stage.height(image.height);
      }
      this.buildElements();
    });
  }

  scaleElement(element) {
    element.scale({ x: this.scale, y: this.scale });
  }

  buildTemplate(callback) {
    if (!this.layer) return;

    if (this.template) {
      this.renderImage(this.template, null, callback);
    } else {
      const template = new Konva.Rect({
        width: this.baseWidth,
        height: this.baseHeight,
        x: 0,
        y: 0,
        fill: this.baseColor,
      });
      this.layer.add(template);
      callback && callback();
    }
  }

  buildElements() {
    this.elements.forEach((element, index) => {
      this.dispachRender(element, index);
    });
  }

  dispachRender(element, index) {
    if (element.type === "text") {
      this.renderText(element, index, () => this.checkAndCallback());
    } else if (element.type == "image") {
      this.renderImage(element, index, () => this.checkAndCallback());
    } else if (element.type == "circle") {
      this.renderCircle(element, index, () => this.checkAndCallback());
    }
  }

  renderText(element, index, callback) {
    const text = new Konva.Text(
      Object.assign({}, { text: element.value }, element.options)
    );

    this.scaleElement(text);
    this.layer.add(text);
    element._item = text;

    callback && callback();
  }

  renderCircle(element, index, callback) {
    const image = new Image();
    const self = this;
    image.setAttribute("crossOrigin", "anonymous");
    image.onload = function () {
      const originRadius = Math.min(image.width, image.height) / 2;
      const scale =
        (element.options.radius * self.scale * self.scale) / originRadius;
      element.options.fillPatternScale = {
        x: scale,
        y: scale,
      };
      element.options.fillPatternOffset = {
        x: image.width / 2,
        y: image.height / 2,
      };
      element.options.fillPatternRepeat = "no-repeat";

      const circle = new Konva.Circle(
        Object.assign({}, { fillPatternImage: image }, element.options)
      );
      self.scaleElement(circle);
      self.layer.add(circle);
      element._item = circle;

      callback && callback();
    };
    image.src = this.proxyURL(element.value);
  }

  renderImage(element, index, callback) {
    const image = new Image();
    const self = this;
    image.setAttribute("crossOrigin", "anonymous");
    image.onload = function () {
      const img = new Konva.Image(
        Object.assign({}, { image: image }, element.options)
      );

      self.scaleElement(img);
      self.layer.add(img);
      element._item = img;

      callback && callback(image);
    };
    image.src = this.proxyURL(element.value);
  }

  isRendedAll() {
    return !find(this.elements, (element) => !element._item);
  }

  checkAndCallback() {
    if (this.isRendedAll()) {
      forEach(this.elements, (element) => {
        const zIndex = _get(element, "options.z");
        const item = _get(element, "_item");
        if (zIndex && item && item.zIndex) {
          console.log(this.elements);
          console.log(zIndex);
          item.zIndex(zIndex);
        }
      });
      this.callback && this.callback(this.getURL());
    }
  }
}

export default function (pVue: typeof Vue, options = {}) {
  pVue.prototype.$PosterBuilder = PosterBuilder;
  pVue.prototype.$posterBuilder = new PosterBuilder();
}
