<template>
  <div class="wrapper merchants-by-view">
    <template v-if="merchants.length > 0">
      <ai-slider
        :list="merchants"
        :options="{
          slidesPerView: 1.8,
          initialSlide: 0,
          freeMode: true,
          spaceBetween: 0,
        }"
      >
        <template v-slot:item="{ item }">
          <merchant :merchant="item" :key="item.id" class="item" />
        </template>
      </ai-slider>
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch, Mixins } from "vue-property-decorator";

import SyncMixin from "@/mixin/SyncMixin";

import AiSlider from "@/view/component/AiSlider.vue";
import Merchant from "./Merchant.vue";

import keys from "lodash/keys";
import values from "lodash/values";
import map from "lodash/map";
import orderBy from "lodash/orderBy";

@Component({
  components: {
    Merchant,
    AiSlider,
  },
})
export default class Home extends Mixins(SyncMixin) {
  merchants: any = [];
  merchantIds: any = {};

  created() {
    this.merchantIds = this.$db.nsGet("websites");

    this.store = "merchant";
    this.load();
  }

  @Watch("list", { deep: true })
  onListChanged() {
    this.list.forEach((m) => {
      if (this.merchantIds[m.id]) {
        this.merchantIds[m.id]["ref"] = m;
      }
    });
    this.sort();
  }

  sort() {
    const vals = values(this.merchantIds);
    this.merchants = map(orderBy(vals, ["date"], ["desc"]), "ref");
  }

  load() {
    this.loadList({
      query: {
        id: keys(this.merchantIds),
      },
    });
  }
}
</script>
<style lang="scss" scoped>
.merchants-by-view {
  width: 100%;
  height: 100%;
  .item {
    margin-left: 20px;
  }
}
</style>
