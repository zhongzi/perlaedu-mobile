<template>
  <div :class="b()">
    <span class="recording-icon-button" @click="record">
      <i
        class="iconfont icon-recording"
        v-bind:class="{ recording: recording, blink: recording }"
      ></i>
    </span>
    <span v-if="recording">录音中({{ seconds }}s)...</span>
    <span v-else-if="sending">正在处理中，请稍后</span>
    <span v-else>点击麦克风开始录制</span>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Mixins, Prop } from "vue-property-decorator";

import SyncMixin from "@/mixin/SyncMixin";
import UploaderNewMixin from "@/mixin/UploaderNew";

import AiButton from "./AiButton.vue";

import differenceInSeconds from "date-fns/differenceInSeconds";

@Component({
  name: "ai-audio-recorder-base",
  components: {
    AiButton,
  },
})
export default class Home extends Mixins(SyncMixin, UploaderNewMixin) {
  @Prop({ type: String, default: "" }) kind: string;
  @Prop({ type: [String, Number], default: 0 }) merchantId: string | number;

  sending = false;
  recording = false;
  startTime: any = null;
  endTime: any = null;
  interval = null;

  get seconds() {
    if (this.startTime && this.endTime) {
      return differenceInSeconds(this.endTime, this.startTime);
    }
    return 0;
  }
}
</script>
<style lang="scss" scoped>
.ai-audio-recorder-base {
  font-size: 12px;
}

.recording-icon-button {
  padding: 10px;
  i {
    font-size: 28px;
    color: #9e9e9e;
  }
}

.recording {
  color: #b71c1c !important;
}

.blink {
  -webkit-animation: blinker 1.5s cubic-bezier(0.5, 0, 1, 1) infinite alternate;
  -moz-animation: blinker 1.5s cubic-bezier(0.5, 0, 1, 1) infinite alternate;
  -o-animation: blinker 1.5s cubic-bezier(0.5, 0, 1, 1) infinite alternate;
  animation: blinker 1.5s cubic-bezier(0.5, 0, 1, 1) infinite alternate;
}
@keyframes blinker {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}
</style>
