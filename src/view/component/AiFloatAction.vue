<template>
  <ai-draggable :isFixed="true" @click="onClick">
    <div :class="b()" :style="style">
      <slot>
        <i :class="['iconfont', 'icon-' + icon]" v-if="icon" />
        <span v-if="label"> {{ label }} </span>
      </slot>
    </div>
  </ai-draggable>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

import AiDraggable from "./AiDraggable.vue";

@Component({
  name: "ai-float-action",
  components: {
    AiDraggable,
  },
})
export default class Home extends Vue {
  @Prop({ type: String, default: null }) icon: string;
  @Prop({ type: String, default: null }) label: string;
  @Prop({ type: String, default: null }) top: string;
  @Prop({ type: String, default: null }) left: string;
  @Prop({ type: String, default: "15px" }) right: string;
  @Prop({ type: String, default: "40px" }) bottom: string;

  get style() {
    return {
      top: this.top,
      left: this.left,
      right: this.right,
      bottom: this.bottom,
    };
  }

  onClick() {
    this.$emit("click");
  }
}
</script>

<style lang="scss" scoped>
.ai-float-action {
  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  background: #fd6700;
  color: #fff;
  padding: 5px 10px;
  border-radius: 10px;

  i {
    font-size: 18px;
  }

  span {
    font-size: 11px;
  }
}
</style>
