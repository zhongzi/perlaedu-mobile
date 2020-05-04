<template>
  <div :class="b()">
    <div :class="b('vec')" @click="$emit('input', !value)">
      <input
        :class="b('vec-input')"
        type="checkbox"
        :value="value"
        @blur="fixIOSScroll"
        @input="(e) => $emit('input', e.target.value)"
      />
      <div :class="b('vec-fake', { checked: value })" />
    </div>
    <slot>
      {{ title }}
    </slot>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Mixins } from "vue-property-decorator";

import PatchMixin from "@/mixin/PatchMixin";

@Component({
  name: "ai-input-check",
})
export default class Home extends Mixins(PatchMixin) {
  @Prop({ type: Boolean, default: false }) value: boolean;
  @Prop({ type: String, default: "" }) title: string;
}
</script>
<style lang="scss" scoped>
.ai-input-check {
  display: flex;
  align-items: center;

  &__vec {
    position: relative;
    margin-right: 5px;

    &-input {
      width: 14px;
      height: 14px;
      border-radius: 4px;
      border: 2px solid rgba(255, 255, 255, 1);
      visibility: hidden;

      &:checked {
        background: pink;
      }
    }
    &-fake {
      position: absolute;
      top: 0;
      left: 0;
      width: 14px;
      height: 14px;
      border-radius: 4px;
      border: 2px solid #fff;
      background: rgba(255, 255, 255, 0);

      &--checked {
        &:before {
          content: "";
          position: absolute;
          top: 2px;
          left: 4px;
          width: 5px;
          height: 8px;
          border: solid white;
          border-width: 0 2px 2px 0;
          transform: rotate(45deg);
        }
      }
    }
  }
}
</style>
