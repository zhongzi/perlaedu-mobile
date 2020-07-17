<template>
  <div class="wrapper qrcode">
    <template v-if="coupon">
      <div class="title">
        {{ title }}
      </div>
      <div class="content">
        <img :src="qrcode" />
        <div>(保密)</div>
        <div>仅向工作人员出示本核销二维码</div>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Mixins } from "vue-property-decorator";

import SyncMixin from "@/mixin/SyncMixin";

import isEmpty from "lodash/isEmpty";

@Component
export default class Home extends Mixins(SyncMixin) {
  @Prop({ type: Object, default: null }) coupon: any;
  @Prop({ type: String, default: "核销二维码" }) title: string;

  get qrcode() {
    return this.$tools.resolveQrcode(this.$router, {
      name: "billManagementCouponDetail",
      params: {
        couponId: this.coupon.id,
      },
      query: {
        code: this.coupon.verification_code,
      },
    });
  }
}
</script>
<style lang="scss" scoped>
.qrcode {
  background: #fff;
  min-height: 68px;
  padding: 15px 10px;
  border-radius: 8px;
  box-shadow: 0px 8px 14px 0px rgba(0, 0, 0, 0.06);

  .title {
    font-weight: 600;
    line-height: 2;
  }
  .content {
    text-align: center;

    img {
      width: 100%;
    }
  }
}
</style>
