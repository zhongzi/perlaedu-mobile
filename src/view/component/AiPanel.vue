<template>
  <div :class="b()">
    <div :class="b('header')" @click="trigger">
      <div :class="b('header-left')">
        <slot name="header"> </slot>
      </div>
      <div v-if="showIcon">
        <i v-if="innerOpen" class="iconfont icon-direction-up" />
        <i v-else class="iconfont icon-direction-down" />
      </div>
    </div>
    <div :class="b('content')" v-if="innerOpen">
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

  innerOpen: boolean = false;

  created() {
    this.innerOpen = this.open;
  }

  trigger() {
    if (this.enableHeaderClickable) {
      this.innerOpen = !this.innerOpen;
      this.$emit("update:open", this.innerOpen);
    }
  }
}
</script>
<style lang="scss" scoped>
.ai-panel {
  &__header {
    background: rgba(255, 255, 255, 1);

    display: flex;
    align-items: baseline;
    justify-content: space-between;

    &-left {
      flex: 1;
    }

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
