<template>
  <div :class="b()" :style="style"></div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component({
  name: "ai-line",
})
export default class Home extends Vue {
  @Prop({ type: String, default: "horizontal" }) mode: string;
  @Prop({ type: Number, default: 1 }) size: number;

  get style() {
    if (this.mode === "vertical") {
      return {
        display: "inline-block",
        width: this.size + "px",
        height: "100%",
      };
    }
    if (this.mode === "horizontal-inline") {
      return {
        display: "inline-block",
        width: "100%",
        height: this.size + "px",
      };
    }
    return {
      width: "100%",
      height: this.size + "px",
    };
  }
}
</script>
<style lang="scss" scoped>
.ai-line {
  background: rgba(237, 237, 237, 1);
  margin: 5px;
}
</style>
