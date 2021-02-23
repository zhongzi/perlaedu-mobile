<template>
  <hui-popup
    :class="[b(), { [b('full')]: full }]"
    :value="value"
    @input="(v) => $emit('input', v)"
    :position="position"
    ref="popup"
  >
    <template v-if="showContent">
      <slot />
    </template>
  </hui-popup>
</template>
<script lang="ts">
import { Component, Vue, Prop, Mixins, Watch } from "vue-property-decorator";

import StopBodyScrollMixin from "@/mixin/StopBodyScrollMixin";

@Component({
  name: "ai-popup",
})
export default class Home extends Mixins(StopBodyScrollMixin) {
  @Prop({ type: Boolean, default: false }) value: boolean;
  @Prop({ type: String, default: "right" }) position: string;
  @Prop({ type: Boolean, default: true }) appendToBody: any;
  @Prop({ type: Boolean, default: true }) full: boolean;

  showContent: boolean = false;

  created() {
    this.SBSAuto = false;
  }

  @Watch("value")
  onShowChanged() {
    this.$bus.$emit("ai:popup", this.value);
    this.stopBodyScroll(this.value);
    if (this.value) {
      this.appendToBody &&
        document.body.appendChild((this.$refs.popup as any).$el);
      this.$nextTick(() => {
        this.showContent = true;
      });
    } else {
      this.appendToBody &&
        document.body.removeChild((this.$refs.popup as any).$el);
      this.showContent = false;
    }
  }
}
</script>
<style lang="scss" scoped>
.ai-popup__full {
  & ::v-deep .h-popup__content {
    height: 100vh;
  }
}
</style>
