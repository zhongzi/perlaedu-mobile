import Vue from "vue";
import Konva from "konva";

import findIndex from "lodash/findIndex";
import debounce from "lodash/debounce";

class PosterBuilder {
  id: any = null;
  name: any = null;
  baseWidth: any = null;
  scale: any = null;
  template: any = null;
  elements: any = null;
  callback: any = null;
  renderStatus: any = null;
  stage: any = null;
  layer: any = null;

  initKonva: any = null;
  build: any = null;

  constructor(
    id = null,
    baseWidth = null,
    name = null,
    template = null,
    elements = null,
    callback = null
  ) {
    this.id && this.setData(id, baseWidth, name, template, elements, callback);
  }

  setData(id, baseWidth, name, template, elements, callback = null) {
    this.id = id;
    this.baseWidth = baseWidth;
    this.scale = 1;
    this.name = name;
    this.template = template;
    this.elements = elements;
    this.callback = callback;
    this.renderStatus = new Array(this.elements.length);

    this.initKonva = debounce(() => {
      this._initKonva();
    }, 1000);

    this.build = debounce(() => {
      this._build();
    }, 1000);

    this.id && this.initKonva();
  }
  _initKonva() {
    if (!this.stage) {
      this.stage = new Konva.Stage({ container: this.id });
    }
    this.stage.clear();
    if (!this.layer) {
      this.layer = new Konva.Layer();
    }
    this.layer.clear();
    this.stage.add(this.layer);
  }

  getURL() {
    if (!this.isRendedAll()) return;
    return this.stage.getStage().toDataURL();
  }

  downloadURL() {
    if (!this.isRendedAll()) return;

    var link = document.createElement("a");
    link.download = name;
    link.href = this.getURL();
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  _build() {
    this.buildTemplate((image) => {
      if (this.baseWidth) {
        this.scale = image.width / this.baseWidth;
      }
      this.stage.width(image.width);
      this.stage.height(image.height);
      this.buildElements();
    });
  }

  // TODO
  scaleElement(element) {
    if (element.width()) {
      element.width(this.scale * element.width());
    }
    if (element.height()) {
      element.height(this.scale * element.height());
    }
    if (element.x()) {
      element.x(this.scale * element.x());
    }
    if (element.y()) {
      element.y(this.scale * element.y());
    }
    if (element.fontSize) {
      element.fontSize(this.scale * element.fontSize());
    }
  }

  buildTemplate(callback) {
    this.renderImage(this.template, null, callback);
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
    let text = new Konva.Text(
      Object.assign({}, { text: element.value }, element.options)
    );

    this.scaleElement(text);
    this.layer.add(text);
    if (index >= 0) this.renderStatus[index] = true;
    callback && callback();
  }

  renderCircle(element, index, callback) {
    let image = new Image();
    let self = this;
    image.setAttribute("crossOrigin", "Anonymous");
    image.onload = function () {
      let originRadius = Math.min(image.width, image.height) / 2;
      let scale =
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

      let zIndex = element.options.zIndex;
      delete element.options.zIndex;

      let circle = new Konva.Circle(
        Object.assign({}, { fillPatternImage: image }, element.options)
      );
      self.scaleElement(circle);
      self.layer.add(circle);
      if (zIndex !== undefined) circle.zIndex(zIndex);
      if (index) self.renderStatus[index] = true;
      callback && callback();
    };
    image.src = element.value;
  }

  renderImage(element, index, callback) {
    let image = new Image();
    let self = this;
    image.setAttribute("crossOrigin", "Anonymous");
    image.onload = function () {
      let zIndex = element.options.zIndex;
      delete element.options.zIndex;

      let img = new Konva.Image(
        Object.assign({}, { image: image }, element.options)
      );

      self.scaleElement(img);
      self.layer.add(img);
      if (zIndex !== undefined) img.zIndex(zIndex);
      if (index) self.renderStatus[index] = true;
      callback && callback(image);
    };
    image.src = element.value;
  }

  isRendedAll() {
    return findIndex(this.renderStatus, (o) => o === undefined) <= 0;
  }

  checkAndCallback() {
    if (this.isRendedAll()) {
      this.callback && this.callback(this.getURL());
    }
  }
}

export default function (pVue: typeof Vue, options = {}) {
  pVue.prototype.$PosterBuilder = PosterBuilder;
}
