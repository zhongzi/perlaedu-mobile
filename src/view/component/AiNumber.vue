<template>
  <div :class="b()">
    <span> {{ num }} </span>
    <span> {{ label }} </span>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component({
  name: "ai-number",
})
export default class Home extends Vue {
  @Prop({ type: Number, default: 0 }) num: number;
  @Prop({ type: String, default: null }) label: string;
}
</script>
<style lang="scss" scoped>
.ai-number {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  span:nth-child(1) {
    font-size: 16px;
    font-family: PingFangSC-Semibold, PingFang SC;
    color: rgba(74, 74, 74, 1);
    line-height: 22px;
  }
  span:nth-child(2) {
    font-size: 12px;
    font-weight: 600;
    color: rgba(74, 74, 74, 1);
    line-height: 17px;
  }
}
</style>
