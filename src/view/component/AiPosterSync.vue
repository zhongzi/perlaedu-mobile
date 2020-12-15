<template>
  <div class="b()">
    <ai-poster :poster="posterData" />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Mixins, Watch, Prop } from "vue-property-decorator";

import SyncMixin from "@/mixin/SyncMixin";

import AiPoster from "./AiPoster.vue";

import _get from "lodash/get";
import merge from "lodash/merge";
import map from "lodash/map";
import isEmpty from "lodash/isEmpty";
import pick from "lodash/pick";

@Component({
  name: "ai-poster-sync",
  components: {
    AiPoster,
  },
})
export default class Home extends Mixins(SyncMixin) {
  @Prop({ type: [String, Number], default: null }) posterId: string | number;
  @Prop({ type: [String, Number], default: null }) templateId: string | number;
  @Prop({ type: Object, default: null }) context: any;

  poster: any = null;
  template: any = null;

  posterData: any = null;

  created() {
    this.loadPoster();
    this.loadPosterTemplate();
    this.rebuildPosterData();
  }

  @Watch("posterId")
  onPosterIdChanged() {
    this.loadPoster();
    this.loadPosterTemplate();
  }

  @Watch("templateId")
  onTemplateIdChanged() {
    this.loadPoster();
    this.loadPosterTemplate();
  }

  @Watch("$route", { deep: true })
  onRouteChanged() {
    this.loadPoster();
    this.loadPosterTemplate();
  }

  @Watch("poster", { deep: true })
  onPosterChanged() {
    this.rebuildPosterData();
  }

  @Watch("template", { deep: true })
  onTemplateChanged() {
    this.rebuildPosterData();
  }

  loadPosterTemplate() {
    let tid =
      _get(this.poster, "template_id") ||
      this.templateId ||
      this.$route.query.templateId;
    if (!tid || tid === _get(this.template, "id")) {
      return;
    }

    this.loadEntityExtra({
      store: "posterTemplate",
      id: tid,
      query: {
        extras: JSON.stringify({
          PosterTemplate: ["elements", "options", "demo"],
          PosterTemplateElement: ["options", "demo"],
        }),
      },
      success: (resp) => {
        this.template = resp.data;
      },
    });
  }

  loadPoster() {
    let pid = this.posterId || this.$route.query.posterId;
    if (pid) {
      this.loadEntityExtra({
        store: "poster",
        id: this.posterId,
        query: {
          extras: "data, url, template",
        },
        success: (resp) => {
          this.poster = resp.data;
          this.template = resp.data.template;
        },
      });
    }
  }

  getValue(key, optionKey = null) {
    /*
      字段值优先级
      - query传递
      - context参数
      - poster资源（如果传递了posterId)
      - posterTemplate / posterTemplateElement资源
     */
    return (
      _get(this.$route.query, key) ||
      _get(this.context, key) ||
      _get(this.poster, optionKey || key) ||
      _get(this.template, optionKey || key)
    );
  }

  resizeImage(img, params) {
    if (isEmpty(img) || isEmpty(params)) return img;
    return this.$options.filters.alioss(img, params);
  }

  rebuildPosterData() {
    const name = this.getValue("title");
    const baseWidth = _get(this.template, "width");
    const baseHeight = _get(this.template, "height");

    const templateImage = this.getValue("bgImage", "options.bgImage");
    const template = {
      type: "image",
      value: this.resizeImage(templateImage, {
        mode: "fill",
        width: baseWidth,
        height: baseHeight,
      }),
      options: {},
    };

    const elements = map(_get(this.template, "elements", []), (element) => {
      let value = this.getValue(element.key, `options.${element.key}`);
      value =
        element.type === "image"
          ? this.resizeImage(value, {
              mode: "fill",
              width: element.width,
              height: element.height,
            })
          : value;
      return {
        type: element.type,
        value: value,
        options: merge(
          element.options || {},
          pick(element, ["x", "y", "z", "width", "height"])
        ),
      };
    });

    if (isEmpty(template.value) && isEmpty(elements)) return;

    this.posterData = {
      name,
      baseWidth,
      baseHeight,
      template,
      elements,
    };
  }
}
</script>
<style lang="scss" scoped>
.render {
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
