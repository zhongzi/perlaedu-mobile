<template>
  <div class="wrapper dashboard">
    <framework>
      <template v-slot:header>
        <quick-entry :merchant="merchant" />
      </template>
      <template v-slot:body>
        <!--
        <quick-search :merchant="merchant"  class="floor"/>
-->
        <floor-overview :merchant="merchant" class="floor" />
        <floor-latest-changes :merchant="merchant" class="floor" />
        <floor-quick-work-entry :merchant="merchant" class="floor" />
        <floor-more :merchant="merchant" class="floor" />
      </template>
    </framework>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Mixins, Watch } from "vue-property-decorator";

import SyncMixin from "@/mixin/SyncMixin";

import Framework from "./component/Framework.vue";
import QuickEntry from "./component/QuickEntry.vue";
import QuickSearch from "./component/QuickSearch.vue";

import FloorOverview from "./component/FloorOverview.vue";
import FloorLatestChanges from "./component/FloorLatestChanges.vue";
import FloorQuickWorkEntry from "./component/FloorQuickWorkEntry.vue";
import FloorMore from "./component/FloorMore.vue";

import isEmpty from "lodash/isEmpty";

@Component({
  components: {
    Framework,
    QuickEntry,
    QuickSearch,
    FloorOverview,
    FloorLatestChanges,
    FloorQuickWorkEntry,
    FloorMore,
  },
})
export default class Home extends Mixins(SyncMixin) {
  get merchant() {
    return this.entity;
  }

  created() {
    this.store = "merchant";
    this.load();

    this.$bus.$on("merchant:switched", (merchantId) => {
      this.load(merchantId);
    });
  }

  load(merchantId = null) {
    this.id = merchantId || this.$auth.user.curr_merch_id;
    if (!this.id || this.id < 1) return;
    this.loadEntity({
      requireColumns: ["statistics"],
      query: {
        extras: JSON.stringify({
          Merchant: ["statistics"],
          MerchantStatistic: [
            "person",
            "group",
            "tag",
            "tag_transaction",
            "tag_price_transaction",
          ],
          PersonStatistic: ["count_by"],
          GroupStatistic: ["count_valid"],
          TagStatistic: ["sum_by_merchant"],
          TagTransactionStatistic: ["sum_by_merchant"],
          TagPriceTransactionStatistic: ["sum_by_merchant"],
        }),
      },
    });
  }
}
</script>
<style lang="scss" scoped>
.dashboard {
  padding-bottom: 30px;
  .floor {
    padding: 7px 15px;
  }
}
</style>
