<template>
  <div class="audio" :style="{ width: width }" @click.stop="play">
    <audio
      ref="audio"
      preload
      hidden
      @loadeddata="loadedData"
      @play="playing = true"
      @ended="playing = false"
      @canplay="canPlay"
      @loadedmetadata="loadedMetaData"
    >
      <source :src="url" type="audio/mpeg" />
    </audio>
    <div class="audio-area">
      <div class="audio-play" v-bind:class="{ play: playing }">
        <i class="iconfont icon-yuyin"></i>
      </div>
      <div class="audio-length">{{ seconds }}"</div>
    </div>
    <!--
    <i class="audio-unread" v-if="value.unread"></i>
-->
    <div class="audio-load-bg" v-if="!loaded">
      <div class="audio-loader"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";

import _get from "lodash/get";

@Component({
  name: "ai-audio-player",
})
export default class Home extends Vue {
  @Prop({ type: Object, default: null }) media: any;
  @Prop({ type: Boolean, default: false }) autoPlay: boolean;

  loaded = false;
  playing = false;
  seconds = 0;
  unread = true;

  get audio() {
    return this.$refs.audio as any;
  }

  get url() {
    return _get(this.media, "file.url");
  }

  get width() {
    return 20 + (this.seconds / 60) * 80 + "%";
  }

  @Watch("playing")
  onPlayingChanged() {
    if (this.playing) {
      this.unread = false;
      this.audio.play();
    } else {
      this.audio.pause();
    }
  }

  play() {
    if (!this.loaded) {
      this.audio.load();
      return;
    }
    this.playing = !this.playing;
  }

  canPlay() {
    console.log("canplay");
    if (!this.seconds || this.seconds <= 0) {
      this.seconds = parseInt(this.audio.duration);
    }
  }

  loadedMetaData() {
    console.log("loadedmetadata");
    if (!this.seconds || this.seconds <= 0) {
      this.seconds = parseInt(this.audio.duration);
    }
  }

  loadedData() {
    console.log("loadeddata");
    if (this.audio.readyState >= 2) {
      this.loaded = true;
      this.seconds = parseInt(this.audio.duration);
      this.playing = this.autoPlay;
    }
  }
}
</script>
<style scoped lang="scss">
.audio {
  display: block;
  position: relative;
  min-width: 80px;
  max-width: 95%;
  height: 32px;
  border-radius: 6px;
  padding: 0 4px;
  margin: 2px 0;
  background-color: #fa8e45;
  border-radius: 4px 17px 17px 17px;
  opacity: 0.9;

  &- {
    &area {
      width: 100%;
      height: 100%;
      cursor: pointer;

      display: flex;
      align-items: center;
      justify-content: space-around;
    }
    &length {
      font-size: 16px;

      font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
      font-weight: bold;
      color: #ffffff;
      line-height: 19px;
      letter-spacing: 1px;
    }
    &play {
      i {
        color: white;
      }
      animation: none;
      &.play {
        animation: audio-playing 1s infinite steps(3);
      }
    }
    &unread {
      position: absolute;
      right: -20px;
      top: 5px;
      width: 12px;
      height: 12px;
      background-color: red;
      border-radius: 50%;
    }
    &alread {
      display: none;
    }
    &load-bg {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: 1400;
      background-color: rgba(255, 255, 255, 0.5);
    }
  }
}
@keyframes audio-playing {
  0% {
    opacity: 0;
  }
  70%,
  100% {
    opacity: 1;
  }
}
@-webkit-keyframes audio-playing {
  0% {
    opacity: 0;
  }
  70%,
  100% {
    opacity: 1;
  }
}
@-moz-keyframes audio-playing {
  0% {
    opacity: 0;
  }
  70%,
  100% {
    opacity: 1;
  }
}
@-o-keyframes audio-playing {
  0% {
    opacity: 0;
  }
  70%,
  100% {
    opacity: 1;
  }
}
</style>
