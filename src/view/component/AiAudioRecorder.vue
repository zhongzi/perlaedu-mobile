<script lang="ts">
import { Component } from "vue-property-decorator";

import Base from "./AiAudioRecorderBase.vue";

import Recorder from "recorder-core";
import "recorder-core/src/engine/mp3";
import "recorder-core/src/engine/mp3-engine";

@Component
export default class Home extends Base {
  recorder: any = null;
  ext = "mp3";

  created() {
    this.recorder = Recorder({
      type: this.ext,
      bitRate: 16,
      sampleRate: 16000,
    });
  }

  record() {
    if (this.sending) {
      this.$hui.toast.info("正在上传，请稍后");
      return;
    }

    this.recording = !this.recording;
    if (this.recording) {
      this.recorder.open(
        () => {
          this.startTime = new Date();
          this.recorder.start();
          this.interval = setInterval(() => {
            this.endTime = new Date();
            if (this.seconds >= 58) {
              this.record();
            }
          }, 1000);
        },
        (err) => {
          console.log(err);
        }
      );
    } else {
      this.sending = true;

      clearInterval(this.interval);
      this.recorder.stop((blob, duration) => {
        this.saveMedia(blob, duration);
      });
    }
  }

  saveMedia(blob, duration) {
    const fileOptions = {
      merchantId: this.merchantId,
      ext: this.ext,
      time: duration,
      size: blob.size,
    };

    this.uploadBlob(blob, "audio", this.kind, fileOptions, (media) => {
      this.$emit("input:media", media);
      this.sending = false;
    });
  }
}
</script>
