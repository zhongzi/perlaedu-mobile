<template>
  <div class="ai-select">
    <select
      class="ai-select__select"
      :value="value"
      @blur="fixIOSScroll"
      @input="(e) => $emit('input', e.target.value)"
    >
      <option
        v-for="(option, index) in options"
        :value="option | safe(valueKey)"
        :key="index"
      >
        {{ option | safe(labelKey) }}
      </option>
    </select>
    <slot name="right">
      <i class="iconfont icon-select" />
    </slot>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch, Mixins } from "vue-property-decorator";

import PatchMixin from "@/mixin/PatchMixin";

import isEqual from "lodash/isEqual";
import isEmpty from "lodash/isEmpty";
import _get from "lodash/get";

@Component
export default class Home extends Mixins(PatchMixin) {
  @Prop({ type: [String, Number], default: "" }) value: string | number;
  @Prop({ type: Array, default: [] }) options: any;
  @Prop({ type: String, default: "key" }) labelKey: string;
  @Prop({ type: String, default: "value" }) valueKey: string;

  created() {
    this.emitDefaultValue();
  }

  @Watch("options", { deep: true })
  onOptionsChanged() {
    this.emitDefaultValue();
  }

  emitDefaultValue() {
    if (isEmpty(this.options)) return;
    if (!isEmpty(this.value) || this.value > 0) return;

    const defaultValue = _get(this.options[0], this.valueKey);
    if (isEqual(this.value, defaultValue)) return;

    this.$emit("input", defaultValue);
  }
}
</script>
<style lang="scss" scoped>
.ai-select {
  display: flex;
  align-items: center;
  justify-content: center;

  border: solid 1px;
  border-radius: 5px;
  padding: 10px;

  &__select {
    width: 100%;
    font-size: 14px;
    color: #4a4a4a;
    border: none;
    outline: none;

    -webkit-appearance: none;

    &:focus {
      outline: none;
      border: none;
      background: #fff;
    }
  }
}
</style>
