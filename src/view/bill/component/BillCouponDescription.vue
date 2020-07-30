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
  .title {
    font-size: 14px;
    font-family: Helvetica;
    color: rgba(84, 84, 84, 1);
    line-height: 2;
    letter-spacing: 1px;
  }
  .content {
    font-size: 13px;
    font-family: Helvetica;
    color: rgba(165, 165, 165, 1);
    line-height: 16px;
    letter-spacing: 1px;
  }
}
</style>
