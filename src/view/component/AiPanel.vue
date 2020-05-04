<template>
  <div :class="b()">
    <div
      :class="b('header')"
      @click="enableHeaderClickable && $emit('update:open', !open)"
    >
      <slot name="header"> </slot>
    </div>
    <div :class="b('content')" v-if="open">
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component({
  name: "ai-panel",
})
export default class Home extends Vue {
  @Prop({ type: Boolean, default: false }) open: boolean;
  @Prop({ type: Boolean, default: true }) enableHeaderClickable: boolean;
}
</script>
<style lang="scss" scoped>
.ai-panel {
  &__header {
    background: rgba(255, 255, 255, 1);
  }

  &__content {
    background: rgba(255, 255, 255, 0.9);
    border-radius: 0px 0px 8px 8px;
    padding: 10px;

    font-size: 12px;
    font-weight: 500;
    color: rgba(74, 74, 74, 1);
    line-height: 17px;
  }
}
</style>
