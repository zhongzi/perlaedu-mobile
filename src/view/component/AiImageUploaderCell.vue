<template>
  <div :class="b()">
    <img :src="url || image" :class="b('image')" />
    <div :class="b('progress')">
      <hui-progress :percentage="percentage" />
      <span> {{ percentage }} % </span>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Mixins, Prop, Watch } from "vue-property-decorator";
import UploaderMixin from "@/mixin/Uploader";

@Component({
  name: "ai-image-uploader-cell",
})
export default class Home extends Mixins(UploaderMixin) {
  @Prop({ default: null }) file: any;
  @Prop({ type: String, default: "other" }) type: string;
  @Prop({ type: [String, Number], default: "" }) prefix: string | number;

  url: string = null;
  image: any = null;
  percentage: number = 0;

  get uploaded() {
    return this.percentage >= 100;
  }

  created() {
    this.uploadHandler();
  }

  @Watch("file", { deep: true })
  onFileChanged() {
    this.uploadHandler();
  }

  previewImage() {
    this.url = null;
    this.image = null;

    const render = new FileReader();
    render.onload = () => {
      this.image = render.result;
    };
    render.readAsDataURL(this.file);
  }

  uploadHandler() {
    if (!this.file) return;

    this.previewImage();
    this.uploadFile(
      this.file,
      this.type,
      this.prefix + "",
      (url) => {
        this.$emit("input", url);
      },
      this.uploadProgress.bind(this)
    );
  }

  uploadProgress(percentage) {
    this.percentage = percentage;
  }
}
</script>

<style lang="scss" scoped>
.ai-image-uploader-cell {
  display: flex;
  align-items: center;
  justify-content: space-between;

  &__image {
    max-width: 20%;
  }

  &__progress {
    min-width: 70%;
    display: flex;
    align-items: center;
    justify-content: space-around;

    span {
      min-width: 50px;
      margin-left: 20px;
    }
  }
}
</style>
