<template>
  <div :class="b()">
    <div :class="b('line')" />
    <div :class="b('title')">
      <slot>
        {{ title }}
      </slot>
    </div>
    <div :class="b('line')" />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component({
  name: "ai-line-header",
})
export default class Home extends Vue {
  @Prop({ type: String, default: null }) title: string;
}
</script>
<style lang="scss" scoped>
.ai-line-header {
  display: flex;
  justify-content: space-between;
  align-items: center;

  &__line {
    flex: 1;
    width: 100%;
    height: 1px;
    background: rgba(74, 74, 74, 1);
    border-radius: 2px;
    opacity: 0.41;
  }

  &__title {
    max-width: 70%;
    margin: 0px 10px;

    text-align: center;
    font-size: 16px;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: rgba(74, 74, 74, 1);
    line-height: 22px;
  }
}
</style>
