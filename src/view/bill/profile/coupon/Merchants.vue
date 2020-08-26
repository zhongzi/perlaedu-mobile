<template>
  <div class="wrapper merchants">
    <ai-list-stored
      resource="merchant"
      :query="query"
      scrollType="slider"
      :sliderOptions="{ slidesPerView: 3, initialSlide: 0, freeMode: true }"
      :hideIfNoData="true"
    >
      <template v-slot:item="{ item }">
        {{ item }}
      </template>
    </ai-list-stored>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

import AiListStored from "@/view/component/AiListStored.vue";

@Component({
  components: {
    AiListStored,
  },
})
export default class Home extends Vue {
  get query() {
    return {
      sort: "statistics.bill.coupon.count_accumulative desc",
      extras: "cover_url",
    };
  }
}
</script>
<style lang="scss" scoped>
.merchants {
}
</style>
