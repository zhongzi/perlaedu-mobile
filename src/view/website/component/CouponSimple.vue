<template>
  <div :class="b()" :style="simpleStyle">
    <div class="value">
      <span> {{ value }}</span>
      <span> {{ unit | safe("unit") }}{{ unit | safe("text") }}</span>
    </div>
    <div class="title">
      {{ coupon.title }}
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

import { BillItemValueType } from "@/enum/bill_item_value_type";

import _get from "lodash/get";
import isEmpty from "lodash/isEmpty";

@Component({
  name: "coupon-simple",
})
export default class Home extends Vue {
  @Prop({ type: Object, default: null }) coupon: any;

  get simpleStyle() {
    return {
      backgroundImage:
        "url(" +
        require("@/asset/image/coupon-bg-simple" + this.$densityStr + ".png") +
        ")",
    };
  }

  get value() {
    return _get(this.coupon, "value");
  }

  get unit() {
    return BillItemValueType[_get(this.coupon, "value_type")];
  }
}
</script>
<style lang="scss" scoped>
.coupon-simple {
  width: 286px;
  height: 79px;
  box-shadow: 0px 3px 10px 0px rgba(255, 255, 255, 0.26);
  border-radius: 8px;
  background-size: cover;

  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0px 20px 0px 10px;

  .value {
    width: 40%;
    span:nth-child(1) {
      font-size: 40px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: rgba(255, 255, 255, 1);
      line-height: 56px;
    }
    span:nth-child(2) {
      font-size: 20px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: rgba(255, 255, 255, 1);
      line-height: 28px;
    }
  }
  .title {
    font-size: 20px;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: rgba(255, 255, 255, 1);
    line-height: 28px;
  }
}
</style>
