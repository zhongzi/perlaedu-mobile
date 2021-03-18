<template>
  <div :class="b()">
    <span :class="{ 'float-mode': isFloat }" :style="mergedStyle">
      {{ content }}
    </span>
    <slot />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component({
  name: "ai-badge",
})
export default class Home extends Vue {
  @Prop({ type: String, default: "" }) content: string;
  @Prop({ type: String, default: "" }) color: string;
  @Prop({ type: Boolean, default: false }) circle: boolean;

  get isFloat() {
    return this.$slots.default && this.$slots.default.length > 0;
  }

  get mergedStyle() {
    return {
      padding: "2px 7px",
      color: "#fff",
      backgroundColor: this.color,
      borderRadius: this.circle ? "50%" : "4px",
    };
  }
}
</script>
<style lang="scss" scoped>
.ai-badge {
  position: relative;
  display: inline-block;

  .float-mode {
    left: calc(100% + 10px);
    bottom: calc(100% + 10px);
  }
}
</style>
