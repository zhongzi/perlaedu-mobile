<template>
  <hui-dialog
    :class="b()"
    :value="value"
    :position="position"
    :appendToBody="appendToBody"
    :hideOnBlur="hideOnBlur"
    @input="(v) => emitShow(v)"
    ref="popup"
  >
    <slot />
    <div :class="b('close')" v-if="enableCloseIcon">
      <i class="iconfont icon-close-circle" @click="emitShow(false)" />
    </div>
  </hui-dialog>
</template>
<script lang="ts">
import { Component, Vue, Prop, Mixins, Watch } from "vue-property-decorator";

import StopBodyScrollMixin from "@/mixin/StopBodyScrollMixin";

@Component({
  name: "ai-dialog",
})
export default class Home extends Mixins(StopBodyScrollMixin) {
  @Prop({ type: Boolean, default: false }) value: boolean;
  @Prop({ type: String, default: "right" }) position: string;
  @Prop({ type: Boolean, default: true }) appendToBody: boolean;
  @Prop({ type: Boolean, default: false }) enableCloseIcon: boolean;
  @Prop({ type: Boolean, default: true }) hideOnBlur: boolean;

  created() {
    this.SBSAuto = false;
  }

  @Watch("value")
  onShowChanged() {
    console.log("ai-dialog", this.value);
    this.reset(this.value);
    this.stopBodyScroll(this.value);
  }

  emitShow(v) {
    this.$emit("input", v);
    this.stopBodyScroll(v);
  }

  reset(v) {
    this.$nextTick(() => {
      if (v && this.appendToBody) {
        document.body.appendChild((this.$refs.popup as any).$el);
      } else {
        document.body.removeChild((this.$refs.popup as any).$el);
      }
    });
  }
}
</script>
<style lang="scss" scoped>
.ai-dialog {
  & ::v-deep .h-popup__content {
    height: 100vh;
  }

  & ::v-deep .h-dialog__mask {
    background-color: rgba(0, 0, 0, 0.8);
  }

  &__close {
    position: absolute;
    bottom: -70px;
    width: 100%;
    text-align: center;
    margin: 5px;

    i {
      color: #fff;
      border-radius: 50%;
      border: 0.5px solid #fff;
      font-size: 40px;
    }
  }
}
</style>
