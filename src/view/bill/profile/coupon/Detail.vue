<template>
  <div class="wrapper coupon">
    <bill-coupon class="card" :coupon="coupon" :showActions="false" />
    <div class="container card">
      <bill-coupon-status class="card" :coupon="coupon" />
      <bill-coupon-description class="card" :coupon="coupon" />
      <bill-coupon-source class="card" :coupon="coupon" />
      <bill-coupon-action class="card" :coupon="coupon" />
    </div>
    <bill-coupon-union v-if="coupon.union" class="card" :union="coupon.union" />
    <bill-coupon-merchant
      v-if="coupon.merchant"
      class="card"
      :merchant="coupon.merchant"
    />
    <ai-fixed-footer v-if="coupon.status === 'taken'">
      <bill-coupon-verification :coupon="coupon" :isStaff="false" />
    </ai-fixed-footer>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Mixins } from "vue-property-decorator";

import SyncMixin from "@/mixin/SyncMixin";

import AiFixedFooter from "@/view/component/AiFixedFooter.vue";

import BillCoupon from "../../component/BillCoupon.vue";
import BillCouponUnion from "../../component/BillCouponUnion.vue";
import BillCouponMerchant from "../../component/BillCouponMerchant.vue";
import BillCouponDescription from "../../component/BillCouponDescription.vue";
import BillCouponVerification from "../../component/BillCouponVerification.vue";
import BillCouponAction from "../../component/BillCouponAction.vue";
import BillCouponStatus from "../../component/BillCouponStatus.vue";
import BillCouponSource from "../../component/BillCouponSource.vue";

@Component({
  components: {
    AiFixedFooter,
    BillCoupon,
    BillCouponUnion,
    BillCouponMerchant,
    BillCouponDescription,
    BillCouponVerification,
    BillCouponAction,
    BillCouponStatus,
    BillCouponSource,
  },
})
export default class Home extends Mixins(SyncMixin) {
  showDialog: boolean = false;

  get coupon() {
    return this.entity;
  }

  created() {
    this.store = "billCoupon";
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
        extras: "item,union,merchant,hashed_id,source,referrer,user,link",
      },
    });
  }

  onClick() {
    if (this.coupon.status === "taken") {
      this.showDialog = true;
    }
  }
}
</script>
<style lang="scss" scoped>
.coupon {
  background: linear-gradient(
    119deg,
    rgba(255, 146, 73, 1) 0%,
    rgba(226, 99, 14, 1) 100%
  );

  min-height: 100vh;
  padding: 20px;

  .card {
    margin-bottom: 10px;
  }
  .container {
    background-color: #fff;
    border-radius: 8px;

    .card {
      margin: 0px;
      padding-top: 0px;
      box-shadow: none;
    }
  }
}
</style>
