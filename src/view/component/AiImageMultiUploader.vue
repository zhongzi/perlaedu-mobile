<template>
  <div :class="b()">
    <vue-file-upload
      ref="uploader"
      @input="upload"
      :multiple="true"
      accept="image/png,image/gif,image/jpeg,image/webp"
    >
      <hui-button :class="b('button')">
        <i class="iconfont icon-upload" />
      </hui-button>
    </vue-file-upload>
    <hui-dialog v-model="showDialog">
      <div :class="b('dialog')">
        <template v-for="(file, index) in files">
          <ai-image-uploader-cell
            :key="index"
            :file="file.file"
            :type="type"
            :prefix="prefix"
            @input="uploaded"
          />
        </template>
        <hui-button :class="b('dialog-confirm')" @click.native="confirm">
          确认
        </hui-button>
      </div>
    </hui-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import VueFileUpload from "vue-upload-component";
import AiImageUploaderCell from "./AiImageUploaderCell.vue";

import cloneDeep from "lodash/cloneDeep";

@Component({
  name: "ai-image-multi-uploader",
  components: {
    VueFileUpload,
    AiImageUploaderCell,
  },
})
export default class Home extends Vue {
  @Prop({ type: String, default: "other" }) type: string;
  @Prop({ type: [String, Number], default: "" }) prefix: string | number;

  showDialog: boolean = false;
  files: any = [];
  urls: any = [];

  upload(files) {
    this.files = this.files.concat(files);
    this.showDialog = true;
  }

  uploaded(url) {
    this.urls.push(url);
  }

  confirm() {
    this.$emit("input", cloneDeep(this.urls));
    this.files = [];
    this.urls = [];
    (this.$refs.uploader as any).clear();
    this.showDialog = false;
  }
}
</script>
<style lang="scss" scoped>
.ai-image-multi-uploader {
  & ::v-deep .file-uploads {
    width: 100%;
  }

  &__button {
    height: 80px;
    width: 100%;
    border: none;
    i {
      font-size: 40px;
      color: #4a4a4a66;
    }
  }

  &__dialog {
    padding: 20px 10px;
    max-height: 500px;

    position: relative;
    overflow-y: scroll;
    padding-bottom: 60px;

    &-confirm {
      margin: 20px 0px 0px;
      width: 100%;
      height: 50px;

      position: fixed;
      left: 0px;
      right: 0px;
      bottom: 0px;
      /* flex: 1; */
      margin: 0px auto;
    }
  }
}
</style>
