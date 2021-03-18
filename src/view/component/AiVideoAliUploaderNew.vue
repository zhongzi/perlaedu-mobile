<template>
  <div :class="b()">
    <ai-input-file
      ref="uploader"
      :class="b('uploader-trigger')"
      icon="plus"
      :multiple="true"
      @change="selectFiles"
    />
    <ai-dialog v-model="openDialog">
      <div :class="b('dialog')">
        <template v-if="isEmptyMedias">
          <h1>未选择视频或者所选视频为重复视频</h1>
        </template>
        <template v-for="media in medias">
          <ai-cell :class="b('dialog-files')" :key="media.md5">
            <template v-slot:cover>
              <div :class="b('dialog-file-cover')">
                <img :src="media.cover" />
              </div>
            </template>
            <template v-slot:title>
              <!--
              <ai-input-switchable
                v-if="media.media"
                class="title"
                v-model="media.media.title"
                mode=""
                @onBlur="saveTitle(media)"
              />
              -->
              <div class="title">{{ media.file.name }}</div>
            </template>
            <template v-slot:remark>
              <span>{{ media.progress >= 100 ? "已上传" : "上传中..." }}</span>
              <hui-progress :percentage="media.progress" />
            </template>
            <template v-slot:right>
              <ai-button @click.native="remove(media)"> 移除 </ai-button>
            </template>
          </ai-cell>
        </template>
      </div>
      <ai-submit-actions
        :submitLabel="submitLabel"
        @submit="onSubmit"
        @cancel="onCancel"
      />
    </ai-dialog>

    <ai-dialog v-model="openPlayer" v-if="curMedia">
      <ai-video-ali-player-new :media="curMedia" />
    </ai-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch, Mixins } from "vue-property-decorator";

import SyncMixin from "@/mixin/SyncMixin";
import UploaderNewMixin from "@/mixin/UploaderNew";

import AiButton from "./AiButton.vue";
import AiCell from "./AiCell.vue";
import AiDialog from "./AiDialog.vue";
import AiInput from "./AiInput.vue";
import AiInputFile from "./AiInputFile.vue";
import AiSubmitActions from "./AiSubmitActions.vue";
import AiInputSwitchable from "./AiInputSwitchable.vue";

import AiVideoAliPlayer from "./AiVideoAliPlayer.vue";

import VideoSnapshot from "video-snapshot";

import _get from "lodash/get";
import has from "lodash/has";
import merge from "lodash/merge";
import isEmpty from "lodash/isEmpty";
import cloneDeep from "lodash/cloneDeep";
import forEach from "lodash/forEach";
import map from "lodash/map";
import findIndex from "lodash/findIndex";

const MD5 = require("crypto-js/md5");

const Stages = {
  start: "开始上传",
  uploading: "正在上传",
  confirm: "确认",
};

@Component({
  name: "ai-video-ali-uploader-new",
  components: {
    AiButton,
    AiCell,
    AiDialog,
    AiInput,
    AiInputFile,
    AiSubmitActions,
    AiInputSwitchable,
  },
})
export default class Home extends Mixins(SyncMixin, UploaderNewMixin) {
  @Prop({ type: String, default: "" }) kind: string;
  @Prop({ type: Number, default: 3 }) limit: number;
  @Prop({ type: [String, Number], default: 0 }) merchantId: string | number;

  uploader: any = null;
  cover: string = "";
  title: string = "";
  description: string = "";

  openDialog: boolean = false;
  openPlayer: boolean = false;
  curMedia: any = null;

  medias: any = {};
  stage: any = Stages.start;

  get submitLabel() {
    return this.stage;
  }

  get isEmptyMedias() {
    return isEmpty(this.medias);
  }

  created() {
    this.store = "media";
  }

  mounted() {
    this.load_scripts();
  }

  @Watch("curMedia", { deep: true })
  onCurMediaChanged() {
    this.cover =
      _get(this.curMedia, "cover") || _get(this.curMedia, "file.cover");
    this.title = _get(this.curMedia, "title");
    this.description = _get(this.curMedia, "description");
  }

  @Watch("openPlayer")
  onOpenPlayerChanged() {
    if (!this.openPlayer) {
      this.curMedia = null;
    }
  }

  load_script(name, url) {
    return new Promise((resolve, reject) => {
      // if script is already loading via another component
      let script = document.getElementById(name);
      if (script) {
        resolve(name);
        return;
      }
      script = document.createElement("script");
      script.setAttribute("src", url);
      script.id = name;
      (script as any).async = true;
      script.onload = () => {
        resolve(name);
      };
      document.head.appendChild(script);
    });
  }

  async load_scripts() {
    const vm = this;
    await vm.load_script(
      "aliyun-upload-sdk",
      "https://files.perlaedu.com/js/aliyun-upload-sdk-1.5.0.min.js"
    );
    await vm.load_script(
      "aliyun-oss-sdk",
      "https://files.perlaedu.com/js/lib/aliyun-oss-sdk-5.3.1.min.js"
    );
    await vm.load_script(
      "es6-promise",
      "https://files.perlaedu.com/js/lib/es6-promise.min.js"
    );
    // do what you want after script has loaded
    vm.uploader = new window.AliyunUpload.Vod({
      userId: "1252197207798095",
      // 文件上传失败
      onUploadFailed: function (uploadInfo, code, message) {
        console.log(
          "onUploadFailed: file:" +
            uploadInfo.file.name +
            ",code:" +
            code +
            ", message:" +
            message
        );
      },
      // 文件上传完成
      onUploadEnd: function (uploadInfo) {
        console.log("onUploadEnd");
        vm.uploaded(uploadInfo);
      },
      // 文件上传进度
      onUploadProgress: function (uploadInfo, totalSize, loadedPercent) {
        console.log("onUploadProgress");
        vm.uploading(uploadInfo, totalSize, loadedPercent);
      },
      // STS临时账号会过期，过期时触发函数
      onUploadTokenExpired: function (uploadInfo) {
        const videoid = uploadInfo.videoId;

        vm.uploadTokenRefresh(uploadInfo).then((uploadAuth) => {
          vm.uploader.resumeUploadWithAuth(uploadAuth);
        });
      },
      // 开始上传
      onUploadstarted: function (uploadInfo) {
        // 实际环境中调用点播的刷新上传凭证接口，获取凭证
        vm.uploadStart(uploadInfo, (media) => {
          vm.uploader.setUploadAuthAndAddress(
            uploadInfo,
            media.file.vod.upload_auth,
            media.file.vod.upload_address,
            media.file.vod.videoid
          );
        });
      },
    });
  }

  getIndexInUploaderListFiles(media) {
    return findIndex(this.uploader.listFiles(), (lf) => {
      return lf.file.md5 === media.md5;
    });
  }

  snapshot(media, callback = null) {
    const snapshoter = new VideoSnapshot(media.file);
    return snapshoter
      .takeSnapshot()
      .then((src) => {
        const img = new Image();
        img.onload = () => {
          fetch(src)
            .then((res) => res.blob())
            .then((blob) => {
              const fileOptions: any = {
                merchantId: this.merchantId,
                ext: "png",
                size: blob.size,
                width: img.width,
                height: img.height,
              };
              this.uploadBlob(blob, "image", "video", fileOptions, (m) => {
                media.cover = m.url;
                callback && callback(media);
              });
            });
        };
        img.src = src;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  selectFiles(event) {
    // this.uploader.cleanList();
    const userData =
      '{"Vod":{"UserData":{"IsShowWaterMark":"false","Priority":"7"}}}';

    if (!isEmpty(event.target.files)) {
      this.stage = Stages.start;
    }

    const files = Array.from(event.target.files).slice(0, this.limit);
    files.forEach((file) => {
      this.md5(file, (md5: string) => {
        if (this.medias[md5]) return;

        (file as any).md5 = md5;
        this.$set(this.medias, md5, {
          md5: md5,
          file: file,
          cover: null,
          media: null,
          progress: 0,
        });
        this.uploader.addFile(file, null, null, null, userData);
        this.snapshot(this.medias[md5]);
      });
    });
    this.openDialog = true;
  }

  uploadStart(uploadInfo, callback) {
    const media = this.uploadInfo2Media(uploadInfo);

    const type = "video";
    const ext = /(?:\.([^.]+))?$/.exec(media.file.name)[1];
    const fileOptions: any = {
      cover: media.cover,
      merchantId: this.merchantId,
      ext: ext,
      size: media.file.size,
    };

    return this.createMedia(
      media.md5,
      type,
      this.kind,
      fileOptions,
      (m: any) => {
        media.media = m;

        if (m.file.is_uploaded) {
          const index = this.getIndexInUploaderListFiles(media);
          media.progress = 100;
          this.uploader.deleteFile(index);
          if (this.uploader.listFiles().length <= 0) {
            this.uploaded();
          }
          return;
        }

        callback(m);
      }
    );
  }

  uploaded(uploadInfo = null) {
    this.stage = Stages.confirm;
  }

  uploadInfo2Media(uploadInfo) {
    const md5 = uploadInfo.file.md5 as string;
    return this.medias[md5];
  }

  uploading(uploadInfo, totalSize, loadedPercent) {
    const media = this.uploadInfo2Media(uploadInfo);

    media.progress = loadedPercent * 100;
    if (media.progress < 100) return;

    this.saveEntity({
      store: "media",
      id: media.media.id,
      res: {
        file: {
          id: media.media.file.id,
          md5: media.md5,
          is_uploaded: true,
        },
      },
    });
  }

  uploadTokenRefresh(uploadInfo) {
    const media = this.uploadInfo2Media(uploadInfo);

    return new Promise((resolve, reject) => {
      this.loadEntity({
        store: "media",
        id: media.id,
        query: {
          extras: JSON.stringify({
            Media: ["file"],
            MediaFile: ["upload_auth"],
          }),
        },
        success: (resp) => {
          resolve(resp.data.file.upload_auth);
        },
        failure: (err) => {
          reject(err.response.data.message);
        },
      });
    });
  }

  onSubmit() {
    if (this.stage === Stages.start && !isEmpty(this.medias)) {
      this.stage = Stages.uploading;
      this.uploader.startUpload();
      return;
    }
    if (this.stage === Stages.confirm) {
      this.$emit(
        "input:media",
        map(this.medias, (media) => {
          return media.media;
        })
      );
      this.onCancel();
      return;
    }
  }

  onCancel() {
    this.medias = [];
    this.openDialog = false;
  }

  saveTitle(media) {
    const id = _get(media, "media.id");
    const title = _get(media, "media.title");
    if (!id || !title || isEmpty(title)) return;

    this.saveEntity({
      store: "media",
      id: id,
      res: {
        id: id,
        title: title,
      },
    });
  }
}
</script>
<style lang="scss" scoped>
.ai-video-ali-uploader-new {
  &__uploader-trigger {
    background: rgba(0, 0, 0, 0.4);
    border-radius: 0px;

    height: 100%;
    width: 100%;
    min-height: auto;

    & ::v-deep i {
      font-size: 1.6rem;
      color: #fff;
    }
  }
}

.ai-video-ali-uploader-new__dialog {
  h1 {
    text-align: center;
    font-size: 16px;
    line-height: 4;
  }

  padding: 10px;
  &-file-cover {
    display: flex;
    flex-direction: column;
    justify-content: center;

    img {
      width: 30px;
      height: 30px;
      object-fit: cover;
    }
  }
}
</style>
