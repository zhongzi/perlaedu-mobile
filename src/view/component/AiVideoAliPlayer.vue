<template>
  <div :class="b()">
    <vue-aliplayer
      v-if="video.play_auth"
      ref="player"
      :class="b('player')"
      :width="width"
      :height="height"
      :vid="video.videoid"
      :playauth="video.play_auth"
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
      <div :class="b('info-title')">{{ video.title }}</div>
      <div :class="b('info-desc')">{{ video.description }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch, Mixins } from "vue-property-decorator";
import SyncMixin from "@/mixin/SyncMixin";

import VueAliplayer from "vue-aliplayer";

@Component({
  name: "ai-video-ali-player",
  components: {
    VueAliplayer,
  },
})
export default class Home extends Mixins(SyncMixin) {
  @Prop({ type: [String, Number] }) videoId: string | number;
  @Prop({ type: String, default: "100%" }) width: string;
  @Prop({ type: String, default: "200px" }) height: string;
  @Prop({ type: Boolean, default: true }) autoplay: boolean;
  @Prop({ type: Boolean, default: true }) showInfo: boolean;

  get video() {
    return this.entity;
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

  created() {
    this.enableLoading = false;
    this.store = "video";
  }

  beforeDestroy() {
    console.log("beforeDestroy");
    const player = this.$refs.player as any;
    setTimeout(() => {
      player.pause();
    }, 2000);
  }

  @Watch("videoId")
  onVideoIdChanged(val) {
    this.loadVideo();
  }

  mounted() {
    this.loadVideo();
  }

  loadVideo() {
    if (!this.videoId) return;

    this.id = this.videoId;
    this.loadEntity({
      id: this.videoId,
      query: {
        extras: "play_auth,videoid",
      },
      success: () => {
        if (!this.autoplay) return;

        setTimeout(() => {
          if (this.$weixin.isInWeixin()) {
            this.$weixin.getNetworkType(() => {
              console.log("weixin:play");
              this.reloadPlay(this.video.videoid, this.video.play_auth);
            });
          } else {
            console.log("web:play");
            this.reloadPlay(this.video.videoid, this.video.play_auth);
          }
        }, 1000);
      },
    });
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
.ai-video-ali-player {
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
