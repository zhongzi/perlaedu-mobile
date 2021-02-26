<template>
  <div class="wrapper dashboard">
    <framework>
      <template v-slot:switch>
        <i
          class="iconfont icon-setting setting"
          @click="openSetting"
          v-if="isOwner"
        />
      </template>
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

import _get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import merge from "lodash/merge";
import cloneDeep from "lodash/cloneDeep";

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
  merchant: any = {};

  get isOwner() {
    const userId = _get(this.merchant, "user_id");
    return !!(userId && userId === _get(this.$auth, "user.id"));
  }

  created() {
    this.store = "merchant";

    this.$bus.$on("merchant:switched", (merchant) => {
      this.merchant = merchant;
      this.load(this.merchant.id);
    });
  }

  resetStatistics(merchant) {
    this.merchant = cloneDeep(
      merge(this.merchant, {
        statistics: merge(this.merchant.statistics, merchant.statistics),
      })
    );
  }

  load(merchantId) {
    this.id = merchantId;
    if (!this.id || this.id < 1) return;

    // 分批加载
    this.loadEntity({
      multiable: true,
      requireColumns: ["statistics"],
      query: {
        extras: JSON.stringify({
          Merchant: ["statistics"],
          MerchantStatistic: ["person", "group"],
          PersonStatistic: ["count_by"],
          GroupStatistic: ["count_valid"],
        }),
      },
      success: (resp) => {
        this.resetStatistics(resp.data);
      },
    });

    this.loadEntity({
      multiable: true,
      requireColumns: ["statistics"],
      query: {
        extras: JSON.stringify({
          Merchant: ["statistics"],
          MerchantStatistic: [
            "tag",
            "tag_transaction",
            "tag_price_transaction",
          ],
          TagStatistic: ["sum_by_merchant"],
          TagTransactionStatistic: ["sum_by_merchant"],
          TagPriceTransactionStatistic: ["sum_by_merchant"],
        }),
      },
      success: (resp) => {
        this.resetStatistics(resp.data);
      },
    });
  }

  openSetting() {
    const url = this.$frontURLResolver.getSetting(this.merchant);
    window.location.href = url;
    return;
  }
}
</script>
<style lang="scss" scoped>
.dashboard {
  padding-bottom: 30px;
  .setting {
    font-size: 24px;
    color: #fff;
    margin: 0px 10px;
  }

  .floor {
    padding: 7px 15px;
  }
}
</style>
