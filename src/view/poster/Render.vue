<template>
  <div class="wrapper render">
    <ai-poster class="content" :poster="posterData" :context="context" />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Mixins, Watch } from "vue-property-decorator";

import SyncMixin from "@/mixin/SyncMixin";

import AiPoster from "@/view/component/AiPoster.vue";

import _get from "lodash/get";
import merge from "lodash/merge";
import map from "lodash/map";
import isEmpty from "lodash/isEmpty";
import pick from "lodash/pick";

@Component({
  components: {
    AiPoster,
  },
})
export default class Home extends Mixins(SyncMixin) {
  posterData: any = null;
  context: any = null;

  posterId: any = null;
  poster: any = null;
  templateId: any = null;
  template: any = null;

  created() {
    this.loadPoster();
    this.loadPosterTemplate();
    this.rebuildPosterData();
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

  loadPoster() {
    this.templateId = this.$route.query.templateId;
    this.templateId &&
      this.loadEntityExtra({
        store: "posterTemplate",
        id: this.templateId,
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

  loadPosterTemplate() {
    this.posterId = this.$route.query.posterId;
    this.posterId &&
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

  resizeImage(img, params) {
    if (isEmpty(img) || isEmpty(params)) return img;

    return this.$options.filters.alioss(img, params);
  }

  rebuildPosterData() {
    /*
      说明， 构造一个海报的数据来源(优先级依次降低):
      - query传递
      - poster资源（如果传递了posterId)
      - posterTemplate / posterTemplateElement资源
     */
    const name =
      this.$route.query.title ||
      _get(this.poster, "title", _get(this.template, "title"));
    const baseWidth = _get(this.template, "width");
    const baseHeight = _get(this.template, "height");

    const templateImage =
      this.$route.query.bgImage ||
      _get(
        this.poster,
        "options.bgImage",
        _get(this.template, "options.bgImage")
      );
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
      const img =
        this.$route.query[element.key] ||
        _get(this.poster, `options.${element.key}`, element.value);
      return {
        type: element.type,
        value: this.resizeImage(img, {
          mode: "fill",
          width: element.width,
          height: element.height,
        }),
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
