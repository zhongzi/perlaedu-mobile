<template>
  <div class="wrapper merchants-by-follow">
    <ai-list-stored
      resource="merchant"
      :query="innerQuery"
      scrollType="slider"
      :sliderOptions="{ slidesPerView: 1.8, initialSlide: 0, freeMode: true }"
    >
      <template v-slot:item="{ item }">
        <merchant :merchant="item" :key="item.id" />
      </template>
    </ai-list-stored>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

import AiListStored from "@/view/component/AiListStored.vue";
import Merchant from "./Merchant.vue";

import merge from "lodash/merge";

@Component({
  components: {
    AiListStored,
    Merchant,
  },
})
export default class Home extends Vue {
  @Prop({ type: Object, default: null }) query: any;

  get innerQuery() {
    return merge({}, this.query || {});
  }
}
</script>
<style lang="scss" scoped>
.merchants-by-follow {
  & ::v-deep .ai-list-stored__title {
    padding: 0px 20px;
  }

  & ::v-deep .ai-slider__swiper-item:nth-child(1) {
    margin-left: 23px;
  }
}
</style>
