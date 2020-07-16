<template>
  <div :class="b()">
    <div :class="b('header')">
      <ai-input-borderless v-model="keyword" placeholder="输入视频名称或标签" />
    </div>
    <ai-list-stored
      resource="video"
      :query="query"
      :refresh="refresh"
      scrollHeight="80vh"
    >
      <template v-slot:item="{ item }">
        <ai-cell :class="b('item')" :showBottomLine="true">
          <template v-slot:cover>
            <img
              :src="item.cover || defaultVideoCover"
              :class="b('item-cover')"
              @click="play(item)"
            />
          </template>
          <template v-slot:title>
            {{ item.title }}
          </template>
          <template v-slot:footer> 简介: {{ item.description }} </template>
          <template v-slot:right>
            <hui-button @click.native="onSelected(item)"> 选择 </hui-button>
          </template>
        </ai-cell>
      </template>
    </ai-list-stored>
    <ai-fixed-footer>
      <ai-submit-actions
        @submit="upload"
        @cancel="$emit('cancel')"
        submitLabel="上传新视频"
      />
    </ai-fixed-footer>
    <hui-dialog v-model="showDialog">
      <div :class="b('dialog')">
        <ai-video-ali-uploader
          @uploaded="onSelected"
          @cancel="showDialog = false"
        />
      </div>
    </hui-dialog>
    <hui-dialog v-model="showPlayer" v-if="showPlayer">
      <div :class="b('dialog-player')">
        <ai-video-ali-player :videoId="curVideo.id" />
      </div>
    </hui-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

import AiInputBorderless from "./AiInputBorderless.vue";
import AiCell from "./AiCell.vue";
import AiListStored from "./AiListStored.vue";
import AiVideoAliUploader from "./AiVideoAliUploader.vue";
import AiVideoAliPlayer from "./AiVideoAliPlayer.vue";
import AiFixedFooter from "./AiFixedFooter.vue";
import AiSubmitActions from "./AiSubmitActions.vue";

import _get from "lodash/get";

@Component({
  name: "ai-video-selector",
  components: {
    AiInputBorderless,
    AiCell,
    AiListStored,
    AiVideoAliUploader,
    AiVideoAliPlayer,
    AiFixedFooter,
    AiSubmitActions,
  },
})
export default class Home extends Vue {
  curVideo: any = null;
  keyword: string = "";
  refresh: boolean = true;
  showDialog: boolean = false;
  showPlayer: boolean = false;

  get defaultVideoCover() {
    return require("@/asset/image/default_video_cover.jpg");
  }

  get query() {
    return {
      merchant_id: _get(this.$auth, "user.curr_merch_id", 0),
      filters: JSON.stringify({
        title: [this.keyword],
        keywords: [this.keyword],
      }),
    };
  }

  upload() {
    this.showDialog = true;
  }

  play(video) {
    this.curVideo = video;
    this.showPlayer = true;
  }

  onSelected(video) {
    this.$emit("selected", video);
    this.showDialog = false;
  }
}
</script>
<style lang="scss" scoped>
.ai-video-selector {
  padding: 20px;
  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &__item {
    width: 100%;
    margin: 10px 0px;
    &-cover {
      width: 100px;
      max-height: 100px;
      margin-right: 5px;
    }
  }
  &__dialog-player {
    height: 500px;
  }
}
</style>
