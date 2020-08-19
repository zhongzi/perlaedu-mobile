<template>
  <div :class="b()">
    <div :class="b('vec')" @click="onInput(!innerValue)">
      <template v-if="mode === 'input'">
        <input
          :class="b('vec-input')"
          type="checkbox"
          :value="innerValue"
          @blur="fixIOSScroll"
        />
        <div :class="b('vec-fake', { checked: innerValue })" />
      </template>
      <template v-else>
        <div :class="[b('vec-icon'), { [b('vec-icon-active')]: innerValue }]">
          <i class="iconfont icon-checked" />
        </div>
      </template>
    </div>
    <slot>
      {{ title }}
    </slot>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch, Mixins } from "vue-property-decorator";

import PatchMixin from "@/mixin/PatchMixin";

@Component({
  name: "ai-input-check",
})
export default class Home extends Mixins(PatchMixin) {
  @Prop({ type: Boolean, default: false }) value: boolean;
  @Prop({ type: String, default: "" }) title: string;
  @Prop({ type: String, default: "input" }) mode: string;

  innerValue: boolean = false;

  created() {
    this.innerValue = this.value;
  }

  @Watch("value")
  onValueChanged() {
    this.innerValue = this.value;
  }

  onInput(v) {
    this.innerValue = v;
    this.$emit("input", this.innerValue);
  }
}
</script>
<style lang="scss" scoped>
.ai-input-check {
  display: flex;
  align-items: center;

  &__vec {
    position: relative;
    margin-right: 5px;
    width: 24px;
    height: 24px;

    &-icon {
      width: 24px;
      height: 24px;
      background: rgba(241, 241, 241, 1);
      border-radius: 6px;

      display: flex;
      align-items: center;
      justify-content: center;

      color: rgb(211, 211, 211);

      i {
        font-size: 12px;
      }
    }
    &-icon-active {
      background: rgba(255, 147, 0, 1);

      color: #fff;
    }

    &-input {
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
      bottom: 0;
      right: 0;
      border-radius: 4px;
      border: 2px solid #fff;
      background: rgba(255, 255, 255, 0);

      &--checked {
        &:before {
          content: "";
          position: absolute;
          top: 0px;
          left: 6px;
          width: 8px;
          height: 15px;
          border: solid white;
          border-width: 0 2px 2px 0;
          transform: rotate(45deg);
        }
      }
    }
  }
}
</style>
