<template>
  <div :class="b()">
    <div :class="b('title')">{{ videoId ? "编辑视频" : "上传视频" }}</div>
    <div :class="b('uploader')" v-if="!videoId">
      <ai-input-file :class="b('uploader-trigger')" @change="selectFile" />

      <div :class="b('uploader-progress')" v-if="selectedFiles.length > 0">
        <div :class="b('uploader-progress-uploading')">
          <hui-progress :percentage="progress" />
          <div>{{ progress >= 100 ? "已上传" : "上传中..." }}</div>
        </div>
        <div :class="b('uploader-progress-snapshoting')">
          <hui-progress v-if="!snapshotCover" />
          <hui-progress v-else :percentage="progress" />
          <div>
            {{
              snapshotCover
                ? "已截图"
                : progress === 100
                ? "截图中..."
                : "待处理..."
            }}
          </div>
        </div>
      </div>
    </div>
    <div :class="b('form')">
      <p class="field">
        <img v-if="snapshotCover" :src="snapshotCover" />
      </p>
      <ai-input class="field" label="视频名称" v-model="form.title" />
      <ai-input class="field" label="视频描述" v-model="form.description" />
      <ai-submit-actions @cancel="onCancel" @submit="onSubmit" />
    </div>
    <hui-dialog v-model="showDialog">
      <div :class="b('dialog')">
        <div :class="b('dialog-title')">上传确认</div>
        <div :class="b('dialog-files')">
          <div v-for="(file, index) of selectedFiles" :key="index">
            {{ file.file.name }}({{ file.file.size | prettyBytes }})
          </div>
        </div>
        <ai-submit-actions
          @cancel="onCancelByConfirm"
          @submit="onSubmitByConfirm"
        />
      </div>
    </hui-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch, Mixins } from "vue-property-decorator";

import SyncMixin from "@/mixin/SyncMixin";

import AiInput from "./AiInput.vue";
import AiSubmitActions from "./AiSubmitActions.vue";
import AiInputFile from "./AiInputFile.vue";

import merge from "lodash/merge";
import isEmpty from "lodash/isEmpty";
import forEach from "lodash/forEach";
import _get from "lodash/get";
import cloneDeep from "lodash/cloneDeep";

@Component({
  name: "ai-video-ali-uploader",
  components: {
    AiInput,
    AiSubmitActions,
    AiInputFile,
  },
})
export default class Home extends Mixins(SyncMixin) {
  @Prop({ type: Number, default: null }) videoId: number;
  @Prop({ type: String, default: "" }) type: string;

  uploader: any = null;
  video: any = {};
  progress: number = 0;
  form: any = {
    title: "",
    description: "",
    keywords: "",
  };
  showDialog: boolean = false;
  selectedFiles: any = {};

  get snapshotCover() {
    return _get(this.video, "events.SnapshotComplete.CoverUrl");
  }

  created() {
    this.enableLoading = false;
    this.store = "video";
    this.loadVideo(this.videoId);
  }

  mounted() {
    !this.videoId && this.load_scripts();
  }

  @Watch("video", { deep: true })
  onVideoChanged() {
    this.form = cloneDeep(this.video);
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
      onUploadSucceed: function (uploadInfo) {
        vm.checkSnapshot();
      },
      // 文件上传进度
      onUploadProgress: function (uploadInfo, totalSize, loadedPercent) {
        vm.progress = loadedPercent * 100;
      },
      // STS临时账号会过期，过期时触发函数
      onUploadTokenExpired: function (uploadInfo) {
        // 实现时，从新获取UploadAuth
        this.loadVideo(() => {
          vm.uploader.resumeUploadWithAuth(vm.video.upload_auth);
        });
      },
      // 开始上传
      onUploadstarted: function (uploadInfo) {
        // 实际环境中调用点播的刷新上传凭证接口，获取凭证
        vm.createVideo(uploadInfo, () => {
          vm.uploader.setUploadAuthAndAddress(
            uploadInfo,
            vm.video.vod.upload_auth,
            vm.video.vod.upload_address,
            vm.video.vod.videoid
          );
        });
      },
    });
    vm.uploader.init();
  }

  selectFile(event) {
    const userData =
      '{"Vod":{"UserData":{"IsShowWaterMark":"false","Priority":"7"}}}';

    this.uploader.cleanList();
    forEach(event.target.files, (file) => {
      this.uploader.addFile(file, null, null, null, userData);
    });
    if (!isEmpty(event.target.files)) {
      this.selectedFiles = this.uploader.listFiles();
      this.showDialog = true;
    }
  }

  createVideo(uploadInfo, callback) {
    this.saveEntity({
      query: {
        extras: "vod,events,upload_auth",
      },
      res: {
        title:
          this.video.title ||
          uploadInfo.file.name.split(".").slice(0, -1).join("."),
        vod: {
          filename: uploadInfo.file.name,
          filesize: uploadInfo.file.size,
          desc: this.video.description,
        },
      },
      success: (resp) => {
        this.video = resp.data;
        callback && callback();
      },
    });
  }

  updateVideo() {
    if (!this.video.id) return;

    this.form.keywords = isEmpty(this.form.keywords)
      ? this.type
      : `${this.type},${this.form.keywords}`;
    this.saveEntity({
      query: {
        extras: "vod,events,upload_auth",
      },
      res: merge(this.form, {
        id: this.video.id,
        cover: this.snapshotCover,
      }),
      success: (resp) => {
        this.$emit("uploaded", resp.data);
      },
    });
  }

  loadVideo(videoId = null, callback = null) {
    this.id = videoId || this.video.id;
    if (!this.id) return;

    this.loadEntity({
      id: this.id,
      query: {
        extras: "vod,events,upload_auth",
      },
      success: (resp) => {
        this.video = resp.data;
        callback && callback();
      },
    });
  }

  checkSnapshot(callback = null) {
    let vm = this;
    setTimeout(() => {
      vm.loadVideo(null, () => {
        if (vm.snapshotCover) {
          callback && callback();
        } else {
          vm.checkSnapshot(callback);
        }
      });
    }, 3000);
  }

  onCancel() {
    this.$emit("cancel");
  }

  onSubmit() {
    this.updateVideo();
  }

  onCancelByConfirm() {
    this.showDialog = false;
    this.uploader.cleanList();
    this.selectedFiles = [];
  }

  onSubmitByConfirm() {
    this.showDialog = false;
    this.uploader.startUpload();
  }
}
</script>
<style lang="scss" scoped>
.ai-video-ali-uploader {
  padding: 50px 20px;

  &__title {
    text-align: center;
    font-size: 16px;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: rgba(74, 74, 74, 1);
    line-height: 22px;
  }

  &__uploader {
    &-trigger {
      margin: 20px 0px;
      border: 1px solid rgba(0, 0, 0, 0.2);
    }

    &-progress {
      padding: 0px 10px 20px;
    }
  }

  &__dialog {
    padding: 20px;
    text-align: center;
    &-title {
      font-size: 14px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: rgba(74, 74, 74, 1);
      line-height: 22px;
    }
    &-files {
      margin: 20px 0px;
    }
  }

  &__form {
    p {
      text-align: center;
      img {
        max-width: 100%;
        max-height: 100px;
      }
    }
  }
}
</style>
