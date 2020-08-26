<template>
  <div class="wrapper coupons">
    <bill-coupon-list
      :query="query"
      :showUser="true"
      :showActions="false"
      couponClickedRoute="billManagementCouponDetail"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

import BillCouponList from "../../component/BillCouponList.vue";

@Component({
  components: {
    BillCouponList,
  },
})
export default class Home extends Vue {
  get query() {
    return {
      openid: this.$route.query.openid,
      "BillCouponAction.openid": this.$auth.user.openid,
      "BillCouponAction.action": "used",
      extras: JSON.stringify({
        BillCoupon: ["user", "union", "merchant", "hashed_id", "item"],
      }),
    };
  }
}
</script>
<style lang="scss" scoped>
.coupons {
  padding: 20px 10px;
}
</style>
