<template>
  <div class="wrapper floor-cell">
    <img class="decoration" :src="icon" v-if="icon && clickable" />
    <div class="left" @click="clickable && $emit('click')">
      <span class="title"> {{ title }} </span>
      <span class="amount" :style="mergedStyle">
        {{ amount | round(decimal) }} <span> {{ unit }} </span>
      </span>
    </div>
    <div class="right" v-if="showPlus">
      <slot name="right">
        <i class="iconfont icon-plus" @click="$emit('clickPlus')" />
      </slot>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component
export default class Home extends Vue {
  @Prop({ type: String, default: null }) title: string;
  @Prop({ type: [String, Number], default: null }) amount: string | number;
  @Prop({ type: String, default: null }) unit: string;
  @Prop({ type: [String, Object], default: null }) icon: any;
  @Prop({ type: Number, default: 0 }) decimal: number;
  @Prop({ type: Boolean, default: true }) clickable: boolean;
  @Prop({ type: Boolean, default: true }) showPlus: boolean;

  get mergedStyle() {
    if (this.amount > 10000) {
      return {
        fontSize: "13px",
      };
    }
    if (this.amount > 1000) {
      return {
        fontSize: "18px",
      };
    }
  }
}
</script>
<style lang="scss" scoped>
.floor-cell {
  position: relative;

  display: flex;
  justify-content: space-between;

  height: 66px;

  padding: 10px;

  background: #ffffff;
  box-shadow: 0px 3px 14px 0px rgba(0, 0, 0, 0.05);
  border-radius: 4px;

  .left {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    flex: 1;

    .title {
      font-size: 13px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #9b9b9b;
      line-height: 18px;
      ont-size: 16px;
    }

    .amount {
      font-size: 20px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #4a4a4a;
      line-height: 28px;

      span {
        font-size: 10px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #4a4a4a;
        line-height: 14px;
      }
    }
  }

  .right {
    i {
      color: #4a4a4a;
      opacity: 0.7;
      font-size: 12px;
      padding: 10px;
    }
  }

  .decoration {
    position: absolute;
    bottom: 0px;
    right: 0px;

    width: 39px;
    height: 33px;
  }
}
</style>
