<template>
  <div :class="b()">
    <div class="limitBox">
      <span> {{ value }}</span>
      <span> {{ unit | safe("unit") }}{{ unit | safe("text") }}</span>
    </div>
    <div class="rangeBox">
      <span class="useLimit" v-if="minBalanceDesc">{{ minBalanceDesc }}</span
      ><br />
      <span class="useRange" v-if="scopeDesc">{{ scopeDesc }}</span
      ><br />
    </div>
    <div class="tip">
      <span>限时优惠</span>
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
  @Prop({ type: String, default: null }) action: string;

  get title() {
    return _get(this.coupon, "title");
  }

  get scopeDesc() {
    return _get(this.coupon.is_overlay) ? "可叠加使用" : "不可叠加使用";
  }

  get minBalanceDesc() {
    const minBalance = _get(this.coupon.min_balance);
    if (minBalance && minBalance > 0) {
      return `满${minBalance}元可用`;
    }
    return "无使用门槛";
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
  width: 90%;
  height: 6rem;
  padding: 0 3%;
  margin: 0 auto 1rem;
  border-radius: 5px;
  background: linear-gradient(90deg, #f66021, #ffbf2f);
  position: relative;
  box-shadow: 5px 5px 10px #989595;

  text-align: left;
  color: #f6ffd9;

  display: flex;
  align-items: flex-end;
  justify-content: space-around;

  .limitBox {
    width: 58%;
    text-align: right;
  }
  .limitBox span:nth-child(1) {
    font-size: 4.2rem;
  }
  .limitBox span:nth-child(2) {
    display: inline-block;
    font-size: 1.5rem;
  }

  .rangeBox {
    font-size: 0.69rem;
  }
  .useRange {
    width: 4.8rem;
    height: 1.3rem;
    background: #fff;
    font-size: 0.9rem;
    display: inline-block;
    color: #ffb02e;
    border-radius: 2px;
    text-align: center;
    line-height: 1.2rem;
    letter-spacing: 1px;
    margin-top: 2px;
  }
  .useLimit {
    font-size: 0.9rem;
    letter-spacing: 2px;
  }
  .tip {
    position: absolute;
    background: linear-gradient(-35deg, transparent 80px, #b9600d 0);
    height: 100%;
    width: 30%;
    left: -0.5%;
    top: -1.2px;
    border-radius: 5px;
  }
  .tip span {
    position: absolute;
    transform: rotate(-35deg);
    font-size: 0.75rem;
    top: 0.7rem;
    left: 0.2rem;
  }
}
</style>
