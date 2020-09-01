<template>
  <div :class="b()" :style="mergedStyle">
    <slot>
      {{ content }}
    </slot>
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

  get mergedStyle() {
    return {
      backgroundColor: this.color,
      borderRadius: this.circle ? "50%" : "4px",
    };
  }
}
</script>
<style lang="scss" scoped>
.ai-badge {
  display: inline-block;
  padding: 2px 7px;
  color: #fff;
}
</style>
