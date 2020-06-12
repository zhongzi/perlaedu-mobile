<template>
  <div class="wrapper balances">
    <ai-list-stored resource="billCouponAction" :query="query" :height="800">
      <template v-slot:item="{ item }">
        <ai-cell class="item">
          <template v-slot:title>
            {{ item.created_at | defaultDate }}
          </template>
          <template v-slot:subtitle>
            <template v-if="item.action === 'funded'">
              <span v-if="item.coupon.source">
                核销 {{ item.coupon.source.item.title }} 一张,
              </span>
              <span>
                送出含备用金优惠券一张, 花费备用金
                {{ item.coupon.item.price }} 元
              </span>
            </template>
            <template v-if="item.action === 'defunded'">
              <span>
                含备用金优惠券失效一张，退还备用金
                {{ item.coupon.item.price }} 元
              </span>
            </template>
            <div>优惠券凭证: {{ item.coupon.hashed_id }}</div>
          </template>
          <template v-slot:right>
            <span class="action"
              >{{ item.action === "funded" ? "花费" : "退还" }}
            </span>
          </template>
        </ai-cell>
      </template>
    </ai-list-stored>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

import AiListStored from "@/view/component/AiListStored.vue";
import AiCell from "@/view/component/AiCell.vue";

import BillCoupon from "../../component/BillCoupon.vue";

import isEmpty from "lodash/isEmpty";

@Component({
  components: {
    AiListStored,
    AiCell,
    BillCoupon,
  },
})
export default class Home extends Vue {
  get query() {
    return {
      action: ["funded", "defunded"],
      merchant_id: this.$auth.user.curr_merch_id,
      extras: JSON.stringify({
        BillCouponAction: ["coupon"],
        BillCoupon: ["user", "union", "merchant", "hashed_id", "item"],
      }),
    };
  }
}
</script>
<style lang="scss" scoped>
.balances {
  width: 100%;
  min-height: 90vh;
  background: linear-gradient(
    119deg,
    rgba(255, 146, 73, 1) 0%,
    rgba(226, 99, 14, 1) 100%
  );
  .item {
    margin: 10px;
    background: #fff;
    border-radius: 5px;
    padding: 10px 20px;
  }
  .action {
    margin-left: 15px;
    min-width: 36px;
  }
}
</style>
