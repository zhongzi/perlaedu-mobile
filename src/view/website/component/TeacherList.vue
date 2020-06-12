<template>
  <div class="wrapper teacher">
    <ai-list-stored
      resource="websiteTeacher"
      :query="innerQuery"
      scrollType="slider"
      :sliderOptions="{ slidesPerView: 3, initialSlide: 0, freeMode: true }"
      :hideIfNoData="true"
    >
      <template v-slot:header>
        <div>金牌师资</div>
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

@Component({
  components: {
    AiListStored,
    Teacher,
  },
})
export default class Home extends Vue {
  @Prop({ type: Object, default: null }) query: any;

  get innerQuery() {
    return merge(
      {
        extras: "teacher",
      },
      this.query || {}
    );
  }
}
</script>
<style lang="scss" scoped>
.teacher {
  & ::v-deep .ai-list-stored__title {
    padding: 0px 27px;
  }

  & ::v-deep .ai-slider__swiper-item:nth-child(1) {
    margin-left: 27px;
  }
}
</style>
