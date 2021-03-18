<template>
  <div :class="b()">
    <img :src="image" :class="b('image')" />
    <div :class="b('progress')">
      <hui-progress :percentage="percentage" />
      <span> {{ percentage }} % </span>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Mixins, Prop, Watch } from "vue-property-decorator";
import UploaderNewMixin from "@/mixin/UploaderNew";

@Component({
  name: "ai-image-uploader-cell-new",
})
export default class Home extends Mixins(UploaderNewMixin) {
  @Prop({ default: null }) file: any;
  @Prop({ type: [Number, String], default: 0 }) merchantId: any;
  @Prop({ type: String, default: "media" }) kind: string;
  @Prop({ type: Boolean, default: true }) enabledCompression: boolean;

  media: string = null;
  image: any = null;
  percentage: number = 0;

  get uploaded() {
    return this.percentage >= 100;
  }

  created() {
    this.requiredCompression = this.enabledCompression;
    this.uploadHandler();
  }

  @Watch("file", { deep: true })
  onFileChanged() {
    this.uploadHandler();
  }

  previewImage() {
    const _URL = window.URL || window.webkitURL;
    console.log(this.file);
    this.image = _URL.createObjectURL(this.file);
  }

  getImageSize(file) {
    return new Promise((resolve, reject) => {
      var _URL = window.URL || window.webkitURL;
      var img = new Image();

      img.onload = () => resolve({ height: img.height, width: img.width });
      img.onerror = reject;

      img.src = _URL.createObjectURL(file);
    });
  }

  uploadHandler() {
    if (!this.file) return;

    const ext = /(?:\.([^.]+))?$/.exec(this.file.name)[1];
    this.previewImage();
    this.getImageSize(this.file).then(({ width, height }) => {
      const fileOptions = {
        width: width,
        height: height,
        merchantId: this.merchantId,
        title: this.file.name,
        size: this.file.size,
        ext: ext,
      };

      this.uploadFile(
        this.file,
        "image",
        this.kind,
        fileOptions,
        (media) => {
          this.$emit("input", media.url);
          this.$emit("input:media", media);
        },
        this.uploadProgress.bind(this)
      );
    });
  }

  uploadProgress(percentage) {
    this.percentage = percentage;
  }
}
</script>

<style lang="scss" scoped>
.ai-image-uploader-cell-new {
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
