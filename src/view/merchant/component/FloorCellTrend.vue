<template>
  <div class="wrapper floor-cell-trend">
    <div class="left">
      <span class="title"> {{ title }} </span>
    </div>
    <div class="right">
      <div class="trend-up">
        <span> {{ numToUp | round(decimal) }} </span>
        <i class="iconfont icon-trend-up" />
      </div>
      <div class="trend-down">
        <span> {{ numToDown | round(decimal) }} </span>
        <i class="iconfont icon-trend-up" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component
export default class Home extends Vue {
  @Prop({ type: String, default: null }) title: string;
  @Prop({ type: [String, Number], default: null }) numToUp: string | number;
  @Prop({ type: [String, Number], default: null }) numToDown: string | number;
  @Prop({ type: Number, default: 0 }) decimal: number;
}
</script>
<style lang="scss" scoped>
.floor-cell-trend {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;

  height: 62px;

  padding: 10px 10px;

  background: #ffffff;
  box-shadow: 0px 3px 14px 0px rgba(0, 0, 0, 0.04);
  border-radius: 4px;

  .left {
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .title {
      font-size: 16px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #4a4a4a;
      line-height: 22px;
    }
  }

  .right {
    .trend-up {
      font-size: 14px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: #a4192a;
      line-height: 20px;
      i {
        font-size: 12px;
        font-weight: normal;
      }
    }
    .trend-down {
      font-size: 14px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: #619e1f;
      line-height: 20px;
      i {
        font-size: 12px;
        font-weight: normal;
        display: inline-block;
        transform: rotate(180deg);
      }
    }
  }
}
</style>
