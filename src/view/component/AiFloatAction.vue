<template>
  <div :class="b()" :style="style" @click.stop="onClick">
    <slot>
      <i :class="['iconfont', 'icon-' + icon]" v-if="icon" />
      <span v-if="label"> {{ label }} </span>
    </slot>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component({
  name: "ai-float-action",
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
  position: fixed;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 10px;
  padding: 10px;
  width: 70px;
  height: 70px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  i {
    font-size: 24px;
  }

  span {
    font-size: 12px;
  }
}
</style>
