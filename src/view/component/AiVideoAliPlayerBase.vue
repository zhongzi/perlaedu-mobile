<template>
  <div :class="b()">
    <vue-aliplayer
      v-if="playAuth"
      ref="player"
      :class="b('player')"
      :cover="cover"
      :width="width"
      :height="height"
      :vid="videoid"
      :playauth="playAuth"
      :skinLayout="skinLayout"
      :autoplay="false"
      :x5_fullscreen="true"
      :useH5Prism="true"
      controlBarVisibility="hover"
      playsinline
      showBarTime="60"
      @play="play"
      @pause="pause"
      @ended="ended"
    />
    <div :class="b('info')" v-if="showInfo">
      <div :class="b('info-title')">{{ media | safe("title") }}</div>
      <div :class="b('info-desc')">{{ media | safe("description") }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";

import VueAliplayer from "vue-aliplayer";

import _get from "lodash/get";
import isEmpty from "lodash/isEmpty";

@Component({
  name: "ai-video-ali-player-base",
  components: {
    VueAliplayer,
  },
})
export default class Home extends Vue {
  @Prop({ type: Object, default: null }) media: string;
  @Prop({ type: String, default: "100%" }) width: string;
  @Prop({ type: String, default: "200px" }) height: string;
  @Prop({ type: Boolean, default: false }) autoplay: boolean;
  @Prop({ type: Boolean, default: false }) showInfo: boolean;

  get cover() {
    const cover = _get(this.media, "cover");
    if (!isEmpty(cover)) return cover;
    return _get(this.media, "file.cover");
  }

  get videoid() {
    return _get(this.media, "file.videoid");
  }

  get playAuth() {
    return _get(this.media, "file.play_auth");
  }

  get skinLayout() {
    return [
      { name: "bigPlayButton", align: "cc" },
      { name: "H5Loading", align: "cc" },
      {
        name: "controlBar",
        align: "blabs",
        x: 0,
        y: 0,
        children: [
          { name: "progress", align: "blabs", x: 0, y: 44 },
          { name: "playButton", align: "tl", x: 15, y: 12 },
          { name: "timeDisplay", align: "tl", x: 10, y: 7 },
          { name: "fullScreenButton", align: "tr", x: 10, y: 12 },
        ],
      },
    ];
  }

  @Watch("media")
  onMediaChanged() {
    this.autoPlay();
  }

  created() {
    this.autoPlay();
  }

  beforeDestroy() {
    const player = this.$refs.player as any;
    setTimeout(() => {
      player.pause();
    }, 2000);
  }

  autoPlay() {
    if (!this.autoplay) return;
    setTimeout(() => {
      if (this.$weixin.isInWeixin()) {
        this.$weixin.getNetworkType(() => {
          console.log("weixin:play");
          this.reloadPlay(this.videoid, this.playAuth);
        });
      } else {
        console.log("web:play");
        this.reloadPlay(this.videoid, this.playAuth);
      }
    }, 1000);
  }

  reloadPlay(vId: string, playAuth: string) {
    const player = this.$refs.player as any;
    setTimeout(() => {
      player.play();
    }, 2000);
  }

  play() {
    this.$emit("play");
  }

  pause() {
    this.$emit("pause");
  }

  ended() {
    this.$emit("ended");
  }
}
</script>

<style lang="scss" scoped>
.ai-video-ali-player-base {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  width: 100%;

  &__info {
    width: 100%;
    margin: 10px 0px 30px;
    &-title {
      font-size: 18px;
      font-weight: 400;
      color: rgba(74, 74, 74, 1);
      line-height: 1.2;
      padding: 0px 20px 10px;
    }
    &-desc {
      font-size: 13px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: rgba(155, 155, 155, 1);
      line-height: 18px;
      padding: 0px 20px;
    }
  }

  &__player {
    & ::v-deep video {
      height: 100% !important;
    }

    & ::v-deep .prism-big-play-btn {
      z-index: 30 !important;
    }
  }
}
</style>
