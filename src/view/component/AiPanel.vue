<template>
  <div :class="b()">
    <div
      :class="b('header')"
      @click="enableHeaderClickable && $emit('update:open', !open)"
    >
      <div>
        <slot name="header"> </slot>
      </div>
      <div v-if="showIcon">
        <i v-if="open" class="iconfont icon-direction-up" />
        <i v-else class="iconfont icon-direction-down" />
      </div>
    </div>
    <div :class="b('content')" v-if="open">
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

import AiLine from "@/view/component/AiLine.vue";

@Component({
  name: "ai-panel",
  components: {
    AiLine,
  },
})
export default class Home extends Vue {
  @Prop({ type: Boolean, default: false }) open: boolean;
  @Prop({ type: Boolean, default: true }) showIcon: boolean;
  @Prop({ type: Boolean, default: true }) enableHeaderClickable: boolean;
}
</script>
<style lang="scss" scoped>
.ai-panel {
  &__header {
    background: rgba(255, 255, 255, 1);

    display: flex;
    align-items: baseline;
    justify-content: space-between;

    i {
      color: #9b9b9b;
    }
  }

  &__content {
    background: rgba(255, 255, 255, 0.9);
    border-radius: 0px 0px 8px 8px;
    padding: 10px 0px;

    font-size: 12px;
    font-weight: 500;
    color: rgba(74, 74, 74, 1);
    line-height: 17px;
    &-line {
      margin: 0px auto 10px;
    }
  }
}
</style>
