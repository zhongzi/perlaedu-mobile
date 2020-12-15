<template>
  <div class="wrapper dashboard">
    <ai-tab-rounded v-model="curTabIdx" :tabs="tabs" label="label" />
    <div class="container">
      <keep-alive>
        <component :is="curTab.comp" />
      </keep-alive>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

import AiTabRounded from "@/view/component/AiTabRounded.vue";

import Poster from "./component/Poster.vue";
import Merchant from "./component/Merchant.vue";
import Profit from "./component/Profit.vue";

@Component({
  components: {
    AiTabRounded,
    Poster,
    Merchant,
    Profit,
  },
})
export default class Home extends Vue {
  tabs: any = [
    { label: "我的客户", value: "merchant", comp: Merchant },
    { label: "我的收益", value: "profit", comp: Profit },
    { label: "推广海报", value: "poster", comp: Poster },
  ];
  curTabIdx: number = 0;

  get curTab() {
    return this.tabs[this.curTabIdx];
  }
}
</script>
<style lang="scss" scoped>
.dashboard {
  padding: 10px;
}
</style>
