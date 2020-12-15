<template>
  <div class="wrapper merchant-list">
    <merchant-recharged-statistics />
    <ai-list-stored resource="merchant" :query="query" scrollHeight="55vh">
      <template v-slot:item="{ item }">
        <merchant-cell :merchant="item" :key="item.id" />
      </template>
    </ai-list-stored>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

import AiListStored from "@/view/component/AiListStored.vue";

import MerchantRechargedStatistics from "./MerchantRechargedStatistics.vue";
import MerchantCell from "./MerchantCell.vue";

@Component({
  components: {
    AiListStored,
    MerchantRechargedStatistics,
    MerchantCell,
  },
})
export default class Home extends Vue {
  get query() {
    return {
      agent_id: this.$auth.user.agent.id,
      sort: "latest_recharged desc",
      extras: "latest_recharged",
    };
  }
}
</script>
<style lang="scss" scoped>
.merchant-list {
  & ::v-deep .ai-infinite-scroll__list {
    flex-direction: column;
    align-items: inherit;
  }
}
</style>
