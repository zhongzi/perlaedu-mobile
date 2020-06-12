<template>
  <div class="wrapper description">
    <div class="title">使用说明</div>
    <div class="content">{{ coupon | safe("item.description") }}</div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component
export default class Home extends Vue {
  @Prop({ type: Object, default: null }) coupon: any;
}
</script>
<style lang="scss" scoped>
.description {
  background: #fff;
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
