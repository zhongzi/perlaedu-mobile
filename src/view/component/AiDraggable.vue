<template>
  <vue-draggable-resizable
    :class="[b(), { [b('fixed')]: isFixed }]"
    :w="w"
    :h="h"
    :parent="isRestrictedInParent"
    :draggable="draggable"
    :resizable="resizable"
    @dragging="onDragging"
  >
    <div @click.stop="onClick">
      <slot />
    </div>
  </vue-draggable-resizable>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

import VueDraggableResizable from "vue-draggable-resizable";
import "vue-draggable-resizable/dist/VueDraggableResizable.css";

@Component({
  name: "ai-draggable",
  components: {
    VueDraggableResizable,
  },
})
export default class Home extends Vue {
  @Prop({ type: [Number, String], default: "auto" }) w: number | string;
  @Prop({ type: [Number, String], default: "auto" }) h: number | string;

  @Prop({ type: Boolean, default: true }) draggable: boolean;
  @Prop({ type: Boolean, default: false }) resizable: boolean;
  @Prop({ type: Boolean, default: false }) isFixed: boolean;
  @Prop({ type: Boolean, default: false }) isRestrictedInParent: boolean;

  isClicked = true;
  onClick() {
    if (!this.isClicked) {
      this.isClicked = true;
      return;
    }

    setTimeout(() => {
      this.isClicked && this.$emit("click");
    }, 200);
  }

  onDragging() {
    this.isClicked = false;
    this.$emit("onDragging");
  }
}
</script>
<style lang="scss" scoped>
.ai-draggable__fixed {
  position: fixed;
  right: 20px;
  bottom: 75px;
  z-index: 399 !important;
}
.ai-draggable {
  border: none;
}
</style>
