<template>
  <div class="wrapper description">
    <div class="title">当前状态</div>
    <div class="content">{{ status | safe("text") }}</div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

import { BillCouponStatus } from "@/enum/bill_coupon_status";

@Component
export default class Home extends Vue {
  @Prop({ type: Object, default: null }) coupon: any;

  get status() {
    return BillCouponStatus[this.coupon.status];
  }
}
</script>
<style lang="scss" scoped>
.description {
  background: #fff;
  height: 68px;
  padding: 15px 10px;
  border-radius: 8px;
  box-shadow: 0px 8px 14px 0px rgba(0, 0, 0, 0.06);

  .title {
    font-weight: 600;
    line-height: 2;
  }
  .content {
    font-size: 14px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #9b9b9b;
    line-height: 1.2;
  }
}
</style>
