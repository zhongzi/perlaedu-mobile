<script lang="ts">
import { Component } from "vue-property-decorator";

import Base from "./AiAudioRecorderBase.vue";

@Component
export default class Home extends Base {
  record() {
    this.$weixin.config(() => {
      if (this.sending) {
        this.$hui.toast.info("正在上传，请稍后");
        return;
      }

      this.recording = !this.recording;
      if (this.recording) {
        this.$weixin.jsapi.startRecord();
        this.startTime = new Date();
        this.interval = setInterval(() => {
          this.endTime = new Date();
          if (this.seconds >= 58) {
            this.record();
          }
        }, 1000);
      } else {
        this.sending = true;

        clearInterval(this.interval);
        this.$weixin.jsapi.stopRecord({
          success: (res) => {
            this.upload(res.localId);
            this.startTime = null;
          },
        });
      }
    });
  }

  upload(localId) {
    this.$weixin.jsapi.uploadVoice({
      localId: localId,
      isShowProgressTips: 1,
      success: (res) => {
        this.saveMedia(res.serverId);
      },
    });
  }

  saveMedia(localId) {
    this.saveEntity({
      store: "media",
      query: {
        extras: "file",
      },
      res: {
        type: "audio",
        kind: this.kind,
        merchant_id: this.merchantId,
        localid: localId,
      },
      success: (resp) => {
        this.$emit("input:media", resp.data);
        this.sending = false;
      },
      failure: (err) => {
        this.$hui.toast.error(err.response.data.message);
        this.sending = false;
      },
    });
  }
}
</script>
