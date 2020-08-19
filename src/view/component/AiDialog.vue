<template>
  <hui-dialog
    :class="b()"
    :value="value"
    @input="(v) => $emit('input', v)"
    :position="position"
    ref="popup"
  >
    <slot />
    <div :class="b('close')" v-if="enableCloseIcon">
      <i class="iconfont icon-close-circle" @click="$emit('input', false)" />
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
  @Prop({ type: Boolean, default: true }) enableCloseIcon: boolean;

  created() {
    this.SBSAuto = false;
  }

  @Watch("value")
  onShowChanged() {
    this.stopBodyScroll(this.value);
    if (this.value && this.appendToBody) {
      document.body.appendChild((this.$refs.popup as any).$el);
    } else {
      document.body.removeChild((this.$refs.popup as any).$el);
    }
  }
}
</script>
<style lang="scss" scoped>
.ai-dialog {
  & ::v-deep .h-popup__content {
    height: 100vh;
  }

  &__close {
    width: 100%;
    text-align: center;
    margin: 5px;

    i {
      background: rgba(255, 255, 255, 0.8);
      color: rgba(0, 0, 0, 0.5);
      border-radius: 50%;
      font-size: 32px;
    }
  }
}
</style>
