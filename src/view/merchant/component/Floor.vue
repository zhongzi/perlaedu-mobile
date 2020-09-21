<template>
  <div class="wrapper floor">
    <div class="header">
      <div class="line" />
      <span>
        {{ title }}
      </span>
    </div>
    <div class="body">
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component
export default class Home extends Vue {
  @Prop({ type: String, default: null }) title: string;
}
</script>
<style lang="scss" scoped>
.floor {
  .header {
    span {
      font-size: 16px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #4a4a4a;
      line-height: 2.5;
    }

    .line {
      display: inline-block;
      width: 3px;
      height: 16px;
      background: linear-gradient(119deg, #ff9249 0%, #e2630e 100%);
      border-radius: 2px;
    }
  }
}
</style>
