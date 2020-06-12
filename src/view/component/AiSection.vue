<template>
  <div :class="b()">
    <div :class="b('header')">
      <slot name="header">
        {{ title }}
      </slot>
    </div>
    <div :class="b('body')">
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component({
  name: "ai-section",
})
export default class Home extends Vue {
  @Prop({ type: String, default: null }) title: string;
}
</script>
<style lang="scss" scoped>
.ai-section {
  display: flex;
  flex-direction: column;
  &__header {
    width: 100%;

    font-size: 16px;
    font-weight: 600;
    color: rgba(74, 74, 74, 1);
    line-height: 3;
  }

  &__body {
    width: 100%;
  }
}
</style>
