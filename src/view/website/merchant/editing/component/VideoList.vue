<template>
  <ai-section class="wrapper editing-videos" title="精彩视频">
    <video-add-entry :merchant="merchant" @refresh="refresh = true" />
    <ai-list-stored
      resource="websiteVideo"
      :query="innerQuery"
      :refresh.sync="refresh"
      scrollType="slider"
      :enableEmpty="false"
      :sliderOptions="{ slidesPerView: 1.1 }"
      class="list"
    >
      <template v-slot:item="{ item, tag }">
        <ai-button-float-delete @delete="onDelete(item, tag)" class="item">
          <a-video :video="item" :enablePlay="false" />
        </ai-button-float-delete>
      </template>
    </ai-list-stored>
  </ai-section>
</template>

<script lang="ts">
import { Component, Vue, Prop, Mixins } from "vue-property-decorator";

import SyncMixin from "@/mixin/SyncMixin";

import AiListStored from "@/view/component/AiListStored.vue";
import AiSection from "@/view/component/AiSection.vue";
import AiButtonFloatDelete from "@/view/component/AiButtonFloatDelete.vue";

import AVideo from "@/view/website/component/Video.vue";

import VideoAddEntry from "./VideoAddEntry.vue";

import merge from "lodash/merge";

@Component({
  components: {
    AiListStored,
    AiSection,
    AiButtonFloatDelete,
    AVideo,
    VideoAddEntry,
  },
})
export default class Home extends Mixins(SyncMixin) {
  @Prop({ type: Object, default: null }) query: any;
  @Prop({ type: Object, default: null }) merchant: any;

  refresh: boolean = false;

  get innerQuery() {
    return merge(
      {
        merchant_id: this.merchant && this.merchant.id,
        extras: "video",
      },
      this.query || {}
    );
  }

  onDelete(video, tag) {
    this.store = "websiteVideo";
    this.id = video.id;
    this.tag = tag;
    this.deleteEntity({
      res: { id: this.id },
      success: () => {
        this.$nextTick(() => {
          this.refresh = true;
        });
      },
    });
  }

  gotoEditingVideo(video) {
    this.$router.push({
      name: "websiteEditingVideo",
      params: {
        videoId: video.id,
      },
    });
  }
}
</script>
<style lang="scss" scoped>
.editing-videos {
  & ::v-deep .ai-section__body {
    display: flex;
    align-items: center;
  }

  .list {
    overflow-x: scroll;
  }
}
</style>
