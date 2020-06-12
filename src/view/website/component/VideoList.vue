<template>
  <div class="wrapper video">
    <ai-list-stored
      resource="websiteVideo"
      :query="innerQuery"
      scrollType="slider"
      :hideIfNoData="true"
      :sliderOptions="{ slidesPerView: 1.8 }"
    >
      <template v-slot:header>
        <div>精彩视频</div>
      </template>
      <template v-slot:item="{ item }">
        <a-video :video="item" :key="item.id" />
      </template>
    </ai-list-stored>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

import SyncMixin from "@/mixin/SyncMixin";

import AiListStored from "@/view/component/AiListStored.vue";
import AVideo from "./Video.vue";

import merge from "lodash/merge";

@Component({
  components: {
    AiListStored,
    AVideo,
  },
})
export default class Home extends Vue {
  @Prop({ type: Object, default: null }) query: any;

  get innerQuery() {
    return merge(
      {
        extras: "video",
      },
      this.query || {}
    );
  }
}
</script>
<style lang="scss" scoped>
.video {
  & ::v-deep .ai-list-stored__title {
    padding: 0px 27px;
  }

  & ::v-deep .ai-slider__swiper-item:nth-child(1) {
    margin-left: 27px;
  }
}
</style>
