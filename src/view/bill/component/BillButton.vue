<template>
  <div :class="b()">
    <i :class="['iconfont', 'icon-' + icon]" />
    <span>{{ label }}</span>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component({
  name: "bill-button",
})
export default class Home extends Vue {
  @Prop({ type: String, default: "" }) label: string;
  @Prop({ type: String, default: "money" }) icon: string;
}
</script>
<style lang="scss" scoped>
.bill-button {
  display: flex;
  align-items: center;
  justify-content: center;

  width: 96px;
  height: 26px;
  background: rgba(255, 255, 255, 1);
  border-radius: 8px;
  opacity: 0.9;
  color: #ff9e16;
  span {
    font-size: 13px;
    font-weight: 500;
    color: rgba(255, 158, 22, 1);
    line-height: 18px;

    margin-left: 10px;
  }
}
</style>
