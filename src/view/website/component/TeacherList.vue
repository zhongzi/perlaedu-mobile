<template>
  <div class="wrapper teacher">
    <ai-list-stored
      resource="websiteTeacher"
      :query="innerQuery"
      scrollType="slider"
      :sliderOptions="{
        slidesPerView: 3.3,
        initialSlide: 0,
        freeMode: true,
        spaceBetween: 10,
      }"
      :hideIfNoData="true"
    >
      <template v-slot:header>
        <img
          v-if="skin.title"
          :src="skin.title.image"
          :style="skin.title.style"
        />
        <div v-else>{{ title || "金牌师资" }}</div>
      </template>
      <template v-slot:item="{ item }">
        <teacher :websiteTeacher="item" class="item" />
      </template>
    </ai-list-stored>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

import SyncMixin from "@/mixin/SyncMixin";

import AiListStored from "@/view/component/AiListStored.vue";
import Teacher from "./Teacher.vue";

import merge from "lodash/merge";
import _get from "lodash/get";

@Component({
  components: {
    AiListStored,
    Teacher,
  },
})
export default class Home extends Vue {
  @Prop({ type: Object, default: null }) query: any;
  @Prop({ type: Object, default: null }) merchant: any;
  @Prop({ type: String, default: null }) title: string;

  get skin() {
    return _get(this.merchant, "website.skin.teacher", {});
  }

  get innerQuery() {
    return merge(
      {
        extras: JSON.stringify({
          WebsiteTeacher: ["teacher"],
          Person: ["sections"],
        }),
      },
      this.query || {}
    );
  }
}
</script>
<style lang="scss" scoped>
.teacher {
  & ::v-deep .ai-list-stored__title {
    padding: 0px 20px;
  }

  & ::v-deep .ai-slider__swiper-item:nth-child(1) {
    margin-left: 20px;
  }
}
</style>
