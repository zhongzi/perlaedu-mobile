<template>
  <div :class="b()">
    <slot>
      <div :class="b('result')" :id="triggerName">
        <img
          v-if="value && enablePreview"
          :src="value"
          :class="b('result-image')"
        />
        <div :class="b('result-icon')">
          <i class="iconfont icon-upload" />
        </div>
      </div>
    </slot>
    <avatar-cropper
      v-show="showCropper"
      :class="b('cropper')"
      mimes="image/*"
      :upload-handler="uploadHandler"
      :cropper-options="cropperOptions"
      :output-options="outputOptions"
      :output-quality="outputQuality"
      :trigger="'#' + triggerName"
      @changed="onChanged"
      ref="cropper"
    />
  </div>
</template>
<script lang="ts">
import { Component, Vue, Mixins, Prop } from "vue-property-decorator";
import UploaderMixin from "@/mixin/Uploader";
import AvatarCropper from "vue-avatar-cropper";

import isEqual from "lodash/isEqual";

@Component({
  name: "ai-image-uploader",
  components: {
    AvatarCropper,
  },
})
export default class Home extends Mixins(UploaderMixin) {
  @Prop({ type: String, default: null }) value: string;
  @Prop({ type: String, default: "other" }) type: string;
  @Prop({ type: String, default: "defaultTrigger" }) triggerName: string;
  @Prop({ type: [String, Number], default: "" }) prefix: string | number;
  @Prop({ type: Boolean, default: true }) enablePreview: boolean;
  @Prop({ type: Boolean, default: true }) enableGif: boolean;
  @Prop({
    type: Object,
    default: () => ({
      aspectRatio: 16 / 9,
      autoCropArea: 1,
      viewMode: 2,
      movable: false,
      zoomable: false,
    }),
  })
  cropperOptions: object;
  @Prop({ type: Object, default: () => ({}) }) outputOptions: object;
  @Prop({ type: Number, default: 1 }) outputQuality: number;

  mimetype: string = "image/png";
  showCropper: boolean = false;

  onChanged(file, reader) {
    if (this.enableGif && isEqual(file.type, "image/gif")) {
      this.$hui.loading.show("上传中...");
      this.uploadFile(file, this.type, this.prefix + "", (url) => {
        this.$emit("input", url);
        setTimeout(() => {
          this.$hui.loading.hide();
          (this.$refs.cropper as any).destroy();
        }, 1000);
      });
      return;
    }
    this.showCropper = true;
    this.mimetype = file.type || this.mimetype;
  }

  uploadHandler(cropper) {
    this.$hui.loading.show("上传中...");
    let canvas = cropper.getCroppedCanvas(this.outputOptions);
    canvas.toBlob(
      (blob) => {
        this.uploadBlob(
          blob,
          this.type,
          this.prefix + "",
          "." + this.mimetype.split("/")[1],
          (url) => {
            this.$emit("input", url);
            setTimeout(() => {
              this.$hui.loading.hide();
              this.showCropper = false;
            }, 1000);
          }
        );
      },
      { type: this.mimetype }
    );
  }

  trigger() {
    let cropper = this.$refs.cropper as any;
    let input = cropper.$refs.input as any;
    input.click();
  }
}
</script>

<style lang="scss" scoped>
.ai-image-uploader {
  text-align: center;
  width: 100%;

  &__result {
    position: relative;
    width: 100%;
    height: 100%;
    min-height: 200px;

    &-image {
      width: 100%;
    }
    &-icon {
      position: absolute;
      left: 0px;
      right: 0px;
      top: 0px;
      bottom: 0px;

      background: rgb(0, 0, 0, 0.4);

      display: flex;
      align-items: center;
      justify-content: center;

      i {
        line-height: 1;
        color: #fff;
        font-size: 80px;
      }
    }
  }
}
</style>
