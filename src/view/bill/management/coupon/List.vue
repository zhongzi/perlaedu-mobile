<template>
  <div class="wrapper coupons">
    <ai-list-stored resource="billCouponAction" :query="query">
      <template v-slot:item="{ item }">
        <bill-coupon
          :key="item.id"
          :coupon="item.coupon"
          :showUser="true"
          :showActions="false"
          class="item"
          @click.native="onClick(item)"
        />
      </template>
    </ai-list-stored>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

import AiListStored from "@/view/component/AiListStored.vue";

import BillCoupon from "../../component/BillCoupon.vue";

import isEmpty from "lodash/isEmpty";

@Component({
  components: {
    AiListStored,
    BillCoupon,
  },
})
export default class Home extends Vue {
  get query() {
    return {
      "BillCoupon.openid": this.$route.query.openid,
      status: "used",
      merchant_id: this.$auth.user.curr_merch_id,
      openid: this.$auth.user.openid,
      extras: JSON.stringify({
        BillCouponAction: ["coupon"],
        BillCoupon: ["user", "union", "merchant", "hashed_id", "item"],
      }),
    };
  }

  onClick(action) {
    this.$router.push({
      name: "billManagementCouponDetail",
      params: {
        couponId: action.coupon_id,
      },
    });
  }
}
</script>
<style lang="scss" scoped>
.coupons {
  padding: 20px 10px;
}
</style>
