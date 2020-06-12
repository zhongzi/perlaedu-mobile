<template>
  <div class="wrapper description">
    <div class="title">来源追踪</div>
    <div class="content">
      <template v-if="coupon.referrer">
        来自微信用户({{ coupon.referrer.nickname }})的推荐
      </template>
      <template v-else>
        <div class="item" v-for="(source, index) in sources" :key="index">
          <span v-if="source.source.referrer_openid === source.openid">
            [推荐奖励]
          </span>
          <span> {{ source.source.user.nickname }} </span>
          <span> {{ getLinkStageText(source.link) }} </span>
          <span> {{ source.source.item.title }} </span>
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

import { BillCouponStatus } from "@/enum/bill_coupon_status";

import _get from "lodash/get";
import forEach from "lodash/forEach";

@Component
export default class Home extends Vue {
  @Prop({ type: Object, default: null }) coupon: any;

  get sources() {
    let sources = [];
    let source = this.coupon;
    while (source && source.link) {
      sources.push(source);
      source = source.source;
    }
    return sources;
  }

  getLinkStageText(link) {
    console.log(link);
    return _get(BillCouponStatus[link.stage], "text", "");
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
