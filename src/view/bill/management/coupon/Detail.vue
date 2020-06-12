<template>
  <div class="wrapper coupon">
    <bill-coupon-user class="card" :user="coupon.user" />
    <bill-coupon class="card" :coupon="coupon" :showActions="false" />
    <div class="container">
      <bill-coupon-status class="card" :coupon="coupon" />
      <bill-coupon-description class="card" :coupon="coupon" />
      <bill-coupon-source class="card" :coupon="coupon" />
      <bill-coupon-action class="card" :coupon="coupon" />
    </div>
    <ai-fixed-footer v-if="coupon.status === 'taken'">
      <bill-coupon-verification :coupon="coupon" />
    </ai-fixed-footer>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Mixins } from "vue-property-decorator";

import SyncMixin from "@/mixin/SyncMixin";

import AiFixedFooter from "@/view/component/AiFixedFooter.vue";

import BillCouponUser from "../../component/BillCouponUser.vue";
import BillCoupon from "../../component/BillCoupon.vue";
import BillCouponDescription from "../../component/BillCouponDescription.vue";
import BillCouponStatus from "../../component/BillCouponStatus.vue";
import BillCouponVerification from "../../component/BillCouponVerification.vue";
import BillCouponAction from "../../component/BillCouponAction.vue";
import BillCouponSource from "../../component/BillCouponSource.vue";

@Component({
  components: {
    AiFixedFooter,
    BillCouponUser,
    BillCoupon,
    BillCouponDescription,
    BillCouponStatus,
    BillCouponVerification,
    BillCouponAction,
    BillCouponSource,
  },
})
export default class Home extends Mixins(SyncMixin) {
  get coupon() {
    return this.entity;
  }

  created() {
    this.store = "billCoupon";
    this.load();

    this.$bus.$on("coupon:refresh", this.load);
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
}
</script>
<style lang="scss" scoped>
.coupon {
  background: linear-gradient(
    119deg,
    rgba(255, 146, 73, 1) 0%,
    rgba(226, 99, 14, 1) 100%
  );

  box-sizing: border-box;
  min-height: 90vh;
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
  .dialog {
    padding: 20px;
    text-align: center;
    img {
      width: 100%;
    }
  }
}
</style>
