<template>
  <div :class="b()">
    <template v-if="!isUsingWxChooseImages">
      <vue-file-upload
        :class="b('button')"
        ref="uploader"
        @input="upload"
        :multiple="true"
        :max="limit"
        accept="image/png,image/gif,image/jpeg,image/webp,image/jpg"
      >
        <slot>
          <i :class="['iconfont', 'icon-' + icon]" />
        </slot>
      </vue-file-upload>
    </template>
    <template v-else>
      <hui-button :class="b('button')" @click.native="wxChooseImages">
        <slot>
          <i class="iconfont icon-upload" />
        </slot>
      </hui-button>
    </template>
    <ai-dialog v-model="showDialog">
      <div :class="b('dialog')">
        <div :class="b('dialog-list')">
          <template v-for="(file, index) in files">
            <ai-image-uploader-cell-new
              :key="index"
              :class="b('dialog-item')"
              :file="file"
              :kind="kind"
              :merchantId="merchantId"
              :enabledCompression="enabledCompression"
              @input:media="addMedia"
            />
          </template>
        </div>
        <ai-submit-actions @cancel="onCancel" @submit="onSubmit" />
      </div>
    </ai-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";

import VueFileUpload from "vue-upload-component";

import AiDialog from "./AiDialog.vue";
import AiSubmitActions from "./AiSubmitActions.vue";
import AiImageUploaderCellNew from "./AiImageUploaderCellNew.vue";

import map from "lodash/map";
import isEmpty from "lodash/isEmpty";
import forEach from "lodash/forEach";
import cloneDeep from "lodash/cloneDeep";
import concat from "lodash/concat";

@Component({
  name: "ai-image-multi-uploader-new",
  components: {
    VueFileUpload,
    AiDialog,
    AiSubmitActions,
    AiImageUploaderCellNew,
  },
})
export default class Home extends Vue {
  @Prop({ type: String, default: "media" }) kind: string;
  @Prop({ type: String, default: "upload" }) icon: string;
  @Prop({ type: Number, default: 9 }) limit: number;
  @Prop({ type: [Number, String], default: 0 }) merchantId: any;
  @Prop({ type: Boolean, default: true }) enabledCompression: boolean;

  showDialog: boolean = false;
  files: any = [];
  medias: any = [];

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
    vm.files = [];
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
                vm.files.push(file);
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
        count: vm.limit,
        sourceType: ["album"],
        success: (res) => {
          vm.wxLoadImages(res.localIds);
        },
      });
    });
  }

  upload(files) {
    if (!isEmpty(this.files)) return;

    this.files = map(files, "file").slice(0, this.limit);
    this.showDialog = true;
  }

  addMedia(media) {
    this.medias = concat(this.medias, media);
  }

  onSubmit() {
    if (!isEmpty(this.medias) || this.medias.length === this.files.length) {
      this.$emit("input:media", cloneDeep(this.medias));
      this.onCancel();
    }
  }

  onCancel() {
    this.showDialog = false;
    (this.$refs.uploader as any).clear();

    this.files = [];
    this.medias = [];
  }
}
</script>
<style lang="scss" scoped>
.ai-image-multi-uploader-new {
  & ::v-deep .file-uploads {
    width: 100%;
    height: 100%;
  }

  &__button {
    background: rgb(0, 0, 0, 0.4);

    display: flex;
    align-items: center;
    justify-content: center;

    i {
      line-height: 1;
      color: #fff;
    }
  }

  &__dialog {
    padding: 20px 10px;

    &-list {
      max-height: 60vh;

      position: relative;
      overflow-y: scroll;
    }

    &-item {
      padding: 5px 15px;
    }
  }
}
</style>
