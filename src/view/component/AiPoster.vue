<template>
  <ai-dialog :class="b()" :value="value" @input="updateValue">
    <div :class="b('content')">
      <img :src="posterImage" :class="b('content-preview')" />
    </div>
    <div :class="b('content')" :id="posterId" v-show="false" />
  </ai-dialog>
</template>
<script lang="ts">
import { Component, Vue, Prop, Mixins, Watch } from "vue-property-decorator";

import AiDialog from "@/view/component/AiDialog.vue";

import forEach from "lodash/forEach";
import template from "lodash/template";
import cloneDeep from "lodash/cloneDeep";

@Component({
  name: "ai-poster",
  components: {
    AiDialog,
  },
})
export default class Home extends Vue {
  @Prop({ type: Boolean, default: false }) value: boolean;
  @Prop({ type: Object, default: null }) poster: any;
  @Prop({ type: String, default: "poster-id" }) posterId: any;
  @Prop({ type: Object, default: () => ({}) }) context: any;

  posterBuilder: any = null;
  posterImage: string = "";

  @Watch("value", { deep: true })
  onValueChanged() {
    this.build();
  }

  @Watch("poster", { deep: true })
  onPosterChanged() {
    this.build();
  }

  @Watch("context", { deep: true })
  onContextChanged() {
    this.build();
  }

  updateValue(v) {
    this.$emit("input", v);
  }

  renderContent(content) {
    const render = template(content);
    return render(this.context);
  }

  buildFinished(url) {
    this.posterImage = url;
  }

  build() {
    if (!this.value) return;

    const name = this.renderContent(this.poster.name);
    const baseWidth = this.poster.baseWidth;
    const template = this.poster.template;
    const elements = cloneDeep(this.poster.elements);
    forEach(elements, (element) => {
      element.value = this.renderContent(element.value);
    });

    if (!this.posterBuilder) {
      this.posterBuilder = new this.$PosterBuilder();
    }

    console.log(
      this.posterId,
      name,
      template,
      elements,
      baseWidth,
      this.buildFinished
    );
    this.posterBuilder.setData(
      this.posterId,
      name,
      template,
      elements,
      baseWidth,
      this.buildFinished
    );
    this.posterBuilder.build();
  }
}
</script>
<style lang="scss" scoped>
.ai-poster {
  & ::v-deep .h-dialog__dialog {
    background: inherit;
  }
  &__content {
    &-preview {
      width: 100%;
      display: block;
    }
  }
}
</style>
