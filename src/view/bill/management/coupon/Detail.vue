<template>
  <div class="wrapper coupon">
    <bill-coupon-user :user="coupon.user" class="user" />
    <bill-coupon :coupon="coupon" />
    <div class="container">
      <bill-coupon-description class="section" :coupon="coupon" />
      <bill-coupon-verification
        class="section"
        :coupon="coupon"
        v-if="coupon.status === 'taken'"
        :isStaff="true"
      />
      <bill-coupon-tip class="section" :coupon="coupon" :isStaff="true" />
      <bill-coupon-source class="section" :coupon="coupon" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Mixins } from "vue-property-decorator";

import SyncMixin from "@/mixin/SyncMixin";

import BillCouponUser from "../../component/BillCouponUser.vue";
import BillCoupon from "../../component/BillCoupon.vue";
import BillCouponDescription from "../../component/BillCouponDescription.vue";
import BillCouponVerification from "../../component/BillCouponVerification.vue";
import BillCouponTip from "../../component/BillCouponTip.vue";
import BillCouponSource from "../../component/BillCouponSource.vue";

@Component({
  components: {
    BillCouponUser,
    BillCoupon,
    BillCouponDescription,
    BillCouponVerification,
    BillCouponTip,
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
  padding: 20px 10px;

  .user {
    margin: 10px;
  }

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
