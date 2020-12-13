<template>
  <div class="wrapper">
    <ai-list-stored
      resource="album"
      :query="innerQuery"
      scrollType="slider"
      :hideIfNoData="true"
      :sliderOptions="{ slidesPerView: 1.8, spaceBetween: 15 }"
    >
      <template v-slot:header>
        <img
          v-if="skin.title"
          :src="skin.title.image"
          :style="skin.title.style"
        />
        <div v-else>{{ title || "机构相册" }}</div>
      </template>
      <template v-slot:item="{ item }">
        <album :album="item" :key="item.id" />
      </template>
    </ai-list-stored>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

import SyncMixin from "@/mixin/SyncMixin";

import AiListStored from "@/view/component/AiListStored.vue";
import Album from "./Album.vue";

import merge from "lodash/merge";
import _get from "lodash/get";

@Component({
  components: {
    AiListStored,
    Album,
  },
})
export default class Home extends Vue {
  @Prop({ type: Object, default: null }) query: any;
  @Prop({ type: Object, default: null }) merchant: any;
  @Prop({ type: String, default: null }) title: string;

  get skin() {
    return _get(this.merchant, "website.skin.album", {});
  }

  get innerQuery() {
    return merge({}, this.query || {});
  }
}
</script>
<style lang="scss" scoped>
.wrapper {
  & ::v-deep .ai-card__header {
    min-height: 80%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  & ::v-deep .ai-list-stored__title {
    padding: 0px 20px;
  }

  & ::v-deep .ai-slider__swiper-item:nth-child(1) {
    margin-left: 20px;
  }
}
</style>
