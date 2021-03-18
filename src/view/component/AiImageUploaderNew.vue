<template>
  <div :class="b()">
    <slot>
      <div :class="b('result')" :id="triggerId">
        <slot name="preview">
          <img
            v-if="previewURL && enablePreview"
            :src="previewURL | alioss(resizeOption)"
            :class="b('result-image')"
          />
        </slot>
        <div :class="b('result-icon')">
          <i :class="['iconfont', 'icon-' + icon]" />
        </div>
      </div>
    </slot>
    <avatar-cropper
      v-show="showCropper"
      mimes="image/jpg, image/png, image/gif, image/jpeg, image/bmp"
      :class="b('cropper')"
      :upload-handler="uploadHandler"
      :cropper-options="innerCropperOptions"
      :output-options="outputOptions"
      :output-quality="outputQuality"
      :trigger="'#' + triggerId"
      @changed="onChanged"
      ref="cropper"
    />
  </div>
</template>
<script lang="ts">
import { Component, Vue, Mixins, Prop } from "vue-property-decorator";
import UploaderNewMixin from "@/mixin/UploaderNew";
import AvatarCropper from "vue-avatar-cropper";

import _get from "lodash/get";
import isEqual from "lodash/isEqual";
import isString from "lodash/isString";
import merge from "lodash/merge";

const uuidv4 = require("uuid/v4");

@Component({
  name: "ai-image-uploader",
  components: {
    AvatarCropper,
  },
})
export default class Home extends Mixins(UploaderNewMixin) {
  @Prop({ type: [String, Number], default: 0 }) merchantId: string | number;
  @Prop({ type: String, default: null }) value: string;
  @Prop({ type: String, default: "media" }) kind: string;
  @Prop({ type: String, default: "upload" }) icon: string;

  @Prop({ type: Object, default: () => ({ width: 200, height: 150 }) })
  resizeOption: any;
  @Prop({ type: Boolean, default: true }) enablePreview: boolean;
  @Prop({ type: Boolean, default: true }) enableGif: boolean;
  @Prop({ type: Boolean, default: true }) flag: boolean;
  @Prop({
    type: Object,
    default: () => ({
      aspectRatio: 0,
      autoCropArea: 1,
      viewMode: 2,
      movable: false,
      zoomable: false,
    }),
  })
  cropperOptions: any;
  @Prop({ type: Object, default: () => ({}) }) outputOptions: object;
  @Prop({ type: Number, default: 1 }) outputQuality: number;

  mimetype: string = "image/png";
  showCropper: boolean = false;

  get previewURL() {
    return isString(this.value) ? this.value : _get(this.value, "url");
  }

  get triggerId() {
    return "image-uploader-" + uuidv4().slice(8);
  }

  get innerCropperOptions() {
    return merge(this.cropperOptions, {
      aspectRatio: this.flag
        ? this.resizeOption.width / this.resizeOption.height
        : this.cropperOptions.aspectRatio,
    });
  }

  onChanged(file, reader) {
    if (this.enableGif && isEqual(file.type, "image/gif")) {
      this.uploadGif(file);
      return;
    }

    this.showCropper = true;
    this.mimetype = file.type || this.mimetype;
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

  uploadGif(file) {
    this.getImageSize(file)
      .then(({ width, height }) => {
        const fileOptions: any = {
          merchantId: this.merchantId,
          title: file.name,
          ext: "gif",
          size: file.size,
          width: width,
          height: height,
        };

        this.$hui.loading.show("上传中...");
        this.uploadFile(file, "image", this.kind, fileOptions, (media) => {
          this.$emit("input", media.url);
          this.$emit("input:media", media);
          setTimeout(() => {
            this.$hui.loading.hide();
            (this.$refs.cropper as any).destroy();
          }, 1000);
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  uploadHandler(cropper) {
    this.$hui.loading.show("上传中...");
    this.mimetype =
      cropper.url.substring("data:".length, cropper.url.indexOf(";base64")) ||
      this.mimetype;

    const ext = this.mimetype.split("/")[1];
    const canvas = cropper.getCroppedCanvas(this.outputOptions);
    canvas.toBlob((blob) => {
      const fileOptions = {
        merchantId: this.merchantId,
        ext: ext,
        size: blob.size,
        width: canvas.width,
        height: canvas.height,
      };

      this.uploadBlob(blob, "image", this.kind, fileOptions, (media) => {
        this.$emit("input", media.url);
        this.$emit("input:media", media);
        setTimeout(() => {
          this.$hui.loading.hide();
          this.showCropper = false;
        }, 1000);
      });
    }, this.mimetype);
  }

  trigger() {
    const cropper = this.$refs.cropper as any;
    const input = cropper.$refs.input as any;
    input.click();
  }
}
</script>

<style lang="scss" scoped>
.ai-image-uploader {
  text-align: center;
  width: 100%;

  & ::v-deep .avatar-cropper-mark {
    background: rgba(0, 0, 0, 0.7);
  }

  &__result {
    position: relative;
    width: 100%;
    height: 100%;

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
      }
    }
  }
}
</style>
