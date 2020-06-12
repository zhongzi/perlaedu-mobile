<template>
  <div class="wrapper">
    <ai-card
      :cover="innerVideo.cover || defaultVideoCover"
      @click.native="onClick"
    >
      <template v-slot:body>
        <div class="title">
          <i class="iconfont icon-video" />
          <span> {{ innerVideo.title }} </span>
        </div>
      </template>
    </ai-card>
    <hui-dialog v-model="showDialog" :appendToBody="true" v-if="showDialog">
      <ai-video-ali-player :videoId="innerVideo.id" class="dialog" />
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
  height: 160px;
  margin: 0px 0px 15px;

  .title {
    display: flex;
    align-items: center;
    justify-content: center;

    text-align: center;
    i {
      font-size: 24px;
      color: rgba(237, 139, 65, 1);
      margin-right: 10px;
    }
  }
}
.dialog {
  height: 500px;
}
</style>
