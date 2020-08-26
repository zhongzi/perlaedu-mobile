<template>
  <div class="wrapper coupon">
    <bill-coupon :coupon="coupon" :showActions="false" />
    <div class="container">
      <template v-if="!isPending">
        <bill-coupon-description class="section" :coupon="coupon" />
        <bill-coupon-verification
          class="section"
          :coupon="coupon"
          v-if="coupon.status === 'taken'"
        />
        <bill-coupon-tip class="section" :coupon="coupon" />
        <bill-coupon-source class="section" :coupon="coupon" />
      </template>
      <template v-else>
        <bill-coupon-description class="section" :coupon="coupon" />
        <bill-coupon-pending :coupon="coupon" />
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Mixins } from "vue-property-decorator";

import SyncMixin from "@/mixin/SyncMixin";

import BillCoupon from "../../component/BillCoupon.vue";
import BillCouponDescription from "../../component/BillCouponDescription.vue";
import BillCouponVerification from "../../component/BillCouponVerification.vue";
import BillCouponTip from "../../component/BillCouponTip.vue";
import BillCouponSource from "../../component/BillCouponSource.vue";
import BillCouponPending from "../../component/BillCouponPending.vue";

import isEmpty from "lodash/isEmpty";
import _get from "lodash/get";

@Component({
  components: {
    BillCoupon,
    BillCouponDescription,
    BillCouponVerification,
    BillCouponTip,
    BillCouponSource,
    BillCouponPending,
  },
})
export default class Home extends Mixins(SyncMixin) {
  get coupon() {
    return this.entity;
  }

  get isTaken() {
    return this.coupon.status === "taken";
  }

  get isPending() {
    return this.coupon.status === "pending";
  }

  created() {
    this.store = "billCoupon";
    this.$bus.$on("bill:coupon:refresh", this.load);
    this.load();
  }

  @Watch("$route", { deep: true })
  onRouteChanged() {
    this.load();
  }

  load() {
    this.id = this.$route.params.couponId;
    this.loadEntity({
      query: {
        require_code: true,
        require_refresh_code: true,
        extras: JSON.stringify({
          BillCoupon: [
            "item",
            "union",
            "merchant",
            "hashed_id",
            "sources",
            "referrer",
            "user",
            "links",
            "count_source",
            "count_source_on_links",
          ],
          Merchant: ["website"],
          Website: ["share"],
          BillCouponLink: ["source", "link"],
          BillItemLink: ["source", "target"],
        }),
      },
    });
  }
}
</script>
<style lang="scss" scoped>
.coupon {
  padding: 20px 10px;

  .container {
    background-color: #fff;
    border-radius: 8px;
    margin: 5px;
    padding: 5px 17px;

    .section {
      margin: 10px auto 30px;
    }
  }
}
</style>
