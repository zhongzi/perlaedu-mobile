<template>
  <div :class="b()" @click.stop="trigger">
    <slot />
    <div :class="b('mask')" v-if="innerChecked" @click.stop="trigger" />
    <i
      class="iconfont icon-check-circle"
      :class="b('icon')"
      v-if="innerChecked"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";

@Component({
  name: "ai-state-check-mask",
})
export default class Home extends Vue {
  @Prop({ type: Boolean, default: false }) checked: boolean;
  @Prop({ type: Boolean, default: true }) enableCheck: boolean;
  @Prop({ type: Boolean, default: true }) enableCancel: boolean;

  innerChecked: boolean = false;

  created() {
    this.innerChecked = this.checked;
  }

  @Watch("checked", { deep: true })
  onCheckedChanged() {
    this.innerChecked = this.checked;
  }

  trigger() {
    if (this.enableCheck) {
      if (!this.enableCancel && this.innerChecked) return;

      this.innerChecked = !this.innerChecked;
      this.$emit("update:checked", this.innerChecked);
    }
  }
}
</script>
<style lang="scss" scoped>
.ai-state-check-mask {
  position: relative;

  &__mask {
    position: absolute;
    top: 0px;
    bottom: 0px;
    left: 0px;
    right: 0px;
    background: rgba(255, 255, 255, 0.5);
  }

  &__icon {
    position: absolute;
    right: 0px;
    bottom: 0px;

    color: #1296db;
  }
}
</style>
