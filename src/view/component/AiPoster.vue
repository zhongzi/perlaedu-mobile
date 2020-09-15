<template>
  <div :class="b()">
    <div :class="b('content')">
      <img :src="posterImage" :class="b('content-preview')" />
    </div>
    <div :class="b('content')" :id="containerId" v-show="false" />
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Mixins, Watch } from "vue-property-decorator";

import isEmpty from "lodash/isEmpty";
import forEach from "lodash/forEach";
import template from "lodash/template";
import cloneDeep from "lodash/cloneDeep";

@Component({
  name: "ai-poster",
})
export default class Home extends Vue {
  @Prop({ type: Object, default: null }) poster: any;
  @Prop({ type: Object, default: () => ({}) }) context: any;
  @Prop({ type: String, default: "poster-container-id" }) containerId: string;

  posterBuilder: any = null;
  posterImage: string = "";

  @Watch("poster", { deep: true })
  onPosterChanged() {
    this.build();
  }

  @Watch("context", { deep: true })
  onContextChanged() {
    this.build();
  }

  created() {
    this.build();
  }

  renderContent(content) {
    if (isEmpty(this.context)) return content;
    return template(content)(this.context);
  }

  buildFinished(url) {
    this.posterImage = url;
    this.$hui.loading.hide();
  }

  build() {
    if (isEmpty(this.poster)) return;
    if (isEmpty(this.poster.elements)) return;

    const name = this.renderContent(this.poster.name);
    const baseWidth = this.poster.baseWidth;
    const baseHeight = this.poster.baseHeight;
    const template = this.poster.template;
    const elements = cloneDeep(this.poster.elements);

    forEach(elements, (element) => {
      element.value = this.renderContent(element.value);
    });

    if (!this.posterBuilder) {
      this.posterBuilder = new this.$PosterBuilder();
    }
    console.log(name, template, elements, baseWidth);

    this.posterBuilder.setData(
      this.containerId,
      name,
      template,
      elements,
      baseWidth,
      baseHeight,
      this.buildFinished
    );
    this.posterBuilder.initKonva();
    this.$hui.loading.show("正在制作中...");
    this.posterBuilder.build();
  }
}
</script>
<style lang="scss" scoped>
.ai-poster {
  &__content {
    &-preview {
      width: 100%;
      display: block;
    }
  }
}
</style>
