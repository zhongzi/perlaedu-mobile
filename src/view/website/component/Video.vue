<template>
  <div class="wrapper">
    <ai-card @click.native="onClick">
      <template v-slot:header>
        <div class="header">
          <img class="cover" :src="innerVideo.cover || defaultVideoCover" />
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
  width: 194px;
  height: 148px;
  margin: 0px 0px 15px;

  .header {
    height: 110px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 5px;

    .cover {
      max-width: 100%;
      max-height: 100%;
      background: rgba(216, 216, 216, 1);
      border-radius: 4px;
    }
  }

  .title {
    display: flex;
    align-items: center;
    margin: 0px 10px 10px;

    line-height: 18px;
    i {
      font-size: 24px;
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
  .player {
    height: 500px;
  }
}
</style>
