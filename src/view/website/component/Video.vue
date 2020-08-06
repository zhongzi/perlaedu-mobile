<template>
  <div class="wrapper">
    <ai-card @click.native="onClick" class="video">
      <template v-slot:header>
        <div class="header">
          <img class="cover" :src="cover" />
        </div>
      </template>
      <template v-slot:footer>
        <div class="title">
          <i class="iconfont icon-video" />
          <span> {{ innerVideo.title }} </span>
        </div>
      </template>
    </ai-card>
    <hui-dialog
      v-model="showDialog"
      :appendToBody="true"
      v-if="showDialog"
      class="dialog"
    >
      <ai-video-ali-player :videoId="innerVideo.id" class="player" />
    </hui-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

import AiCard from "@/view/component/AiCard.vue";
import AiVideoAliPlayer from "@/view/component/AiVideoAliPlayer.vue";

import isEmpty from "lodash/isEmpty";

@Component({
  components: {
    AiCard,
    AiVideoAliPlayer,
  },
})
export default class Home extends Vue {
  @Prop({ type: Object, default: null }) video: any;

  showDialog: boolean = false;

  get defaultVideoCover() {
    return require("@/asset/image/default_video_cover.jpg");
  }

  get cover() {
    return this.innerVideo.cover
      ? this.$options.filters.alioss(this.innerVideo.cover, {
          width: 320,
          height: 180,
          mode: "fill",
        })
      : this.defaultVideoCover;
  }

  get innerVideo() {
    return this.video.video || this.video;
  }

  onClick() {
    this.showDialog = true;
  }
}
</script>
<style lang="scss" scoped>
.wrapper {
  height: 148px;
  margin-bottom: 15px;
  box-shadow: 0px 8px 14px 0px rgba(0, 0, 0, 0.06);
  border-radius: 8px;
  overflow: hidden;

  .video {
    background: rgba(255, 255, 255, 0.8);
  }

  .header {
    height: 110px;
    margin: 4px;
    border-radius: 4px;
    overflow: hidden;

    .cover {
      border-radius: 4px;
      object-fit: fill;
    }
  }

  .title {
    display: flex;
    align-items: center;
    margin: 0px 10px;

    line-height: 1.5;
    i {
      font-size: 20px;
      color: rgba(237, 139, 65, 1);
      margin-right: 10px;
    }

    span {
      max-width: 80%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      font-size: 14px;
    }
  }
}
.dialog {
  & ::v-deep .h-dialog__dialog {
    border-radius: 0px;
  }
}
</style>
