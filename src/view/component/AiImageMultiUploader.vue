<template>
  <div :class="b()">
    <template v-if="!isUsingWxChooseImages">
      <vue-file-upload
        ref="uploader"
        @input="upload"
        :multiple="true"
        :max="count"
        accept="image/png,image/gif,image/jpeg,image/webp,image/jpg"
      >
        <hui-button :class="b('button')">
          <slot>
            <i class="iconfont icon-upload" />
          </slot>
        </hui-button>
      </vue-file-upload>
    </template>
    <template v-else>
      <hui-button :class="b('button')" @click.native="wxChooseImages">
        <slot>
          <i class="iconfont icon-upload" />
        </slot>
      </hui-button>
    </template>
    <hui-dialog v-model="showDialog" :appendToBody="true">
      <div :class="b('dialog')">
        <div :class="b('dialog-list')">
          <template v-for="(file, index) in files">
            <ai-image-uploader-cell
              :class="b('dialog-item')"
              :key="index"
              :file="file.file"
              :type="type"
              :prefix="prefix"
              :enabledCompression="enabledCompression"
              @input:file="uploaded"
            />
          </template>
        </div>
        <hui-button
          :class="b('dialog-confirm')"
          @click.native="confirm"
          type="primary"
        >
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

import isEmpty from "lodash/isEmpty";
import forEach from "lodash/forEach";
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
  @Prop({ type: Number, default: 9 }) count: number;
  @Prop({ type: [String, Number], default: "" }) prefix: string | number;
  @Prop({ type: Boolean, default: true }) enabledCompression: boolean;

  showDialog: boolean = false;
  files: any = [];
  urls: any = [];
  uploadedFiles: any = [];

  get isUsingWxChooseImages() {
    /*
     * - 微信图片选在在mac客户端下面无法多选
     *   https://developers.weixin.qq.com/community/develop/doc/00062891dd8c50a064f9d3dfa51000
     * - 安卓手机上面会对multiple属性支持不好，存在无法多选的问题, 只能选择微信图像选择接口
     *   https://www.zhihu.com/question/24212111
     */
    const isInPCMacOrWin =
      this.$client.device.isPC &&
      (this.$client.pc.isMac || this.$client.pc.isWin);
    return this.$weixin && this.$weixin.isInWeixin() && !isInPCMacOrWin;
  }

  async wxLoadImages(localIds) {
    const vm = this;
    for (var i = 0; i < localIds.length; i++) {
      await new Promise((resolve, reject) => {
        vm.$weixin.jsapi.getLocalImgData({
          localId: localIds[i],
          success: (r) => {
            let localData = r.localData;
            if (localData.indexOf("data:image") != 0) {
              localData = "data:image/jpeg;base64," + localData;
            }

            fetch(localData)
              .then((r) => r.blob())
              .then((blob) => {
                const file = new File([blob], "image.jpeg", {
                  type: "image/jpeg",
                });
                vm.files.push({ file });
                resolve("done");
              });
          },
          fail: (err) => {
            reject(err);
          },
        });
      });
    }
    vm.showDialog = true;
  }

  wxChooseImages() {
    const vm = this;
    vm.$weixin.config(() => {
      vm.$weixin.jsapi.chooseImage({
        count: vm.count,
        sourceType: ["album"],
        success: (res) => {
          vm.wxLoadImages(res.localIds);
        },
      });
    });
  }

  upload(files) {
    this.files = this.files.concat(files);
    this.showDialog = true;
  }

  uploaded(url, file) {
    this.urls.push(url);
    this.uploadedFiles.push(file);
  }

  confirm() {
    if (
      isEmpty(this.uploadedFiles) ||
      this.uploadedFiles.length !== this.files.length
    )
      return;

    this.$emit("input", cloneDeep(this.urls));
    this.$emit("input:file", cloneDeep(this.uploadedFiles));
    this.files = [];
    this.urls = [];
    this.uploadedFiles = [];

    const uploader = this.$refs.uploader as any;
    uploader && uploader.clear();
    this.showDialog = false;
  }
}
</script>
<style lang="scss" scoped>
.ai-image-multi-uploader {
  & ::v-deep .file-uploads {
    width: 100%;
    height: 100%;
  }

  &__button {
    min-height: 80px;
    width: 100%;
    height: 100%;
    border: none;
    i {
      font-size: 40px;
      color: #4a4a4a66;
    }
  }

  &__dialog {
    padding: 20px 10px;

    &-list {
      max-height: 500px;

      position: relative;
      overflow-y: scroll;
    }

    &-item {
      padding: 5px 15px;
    }

    &-confirm {
      display: block;
      margin: 30px auto 5px;
      height: 50px;
      width: 90%;
    }
  }
}
</style>
