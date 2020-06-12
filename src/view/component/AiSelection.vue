<template>
  <div :class="b()">
    <div :class="b('label')" v-if="label">
      {{ label }}
    </div>
    <div :class="b('input')">
      <select
        :class="b('select')"
        :value="value"
        @blur="fixIOSScroll"
        @input="(e) => $emit('input', e.target.value)"
      >
        <option
          v-for="(option, index) in options"
          :value="option | safe(valueKey, option)"
          :key="index"
          :class="b('select-option')"
        >
          <slot
            name="option"
            :option="option"
            :value="option | safe(valueKey, option)"
            :label="option | safe(labelKey, option)"
          >
            {{ option | safe(labelKey, option) }}
          </slot>
        </option>
      </select>
      <slot name="right">
        <i class="iconfont icon-select" />
      </slot>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch, Mixins } from "vue-property-decorator";

import PatchMixin from "@/mixin/PatchMixin";

import isEqual from "lodash/isEqual";
import isEmpty from "lodash/isEmpty";
import _get from "lodash/get";

@Component({
  name: "ai-select",
})
export default class Home extends Mixins(PatchMixin) {
  @Prop({ type: [String, Number], default: "" }) value: string | number;
  @Prop({ type: Array, default: [] }) options: any;
  @Prop({ type: String, default: null }) label: string;
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

    const defaultValue = _get(this.options[0], this.valueKey, this.options[0]);
    if (isEqual(this.value, defaultValue)) return;

    this.$emit("input", defaultValue);
  }
}
</script>
<style lang="scss" scoped>
.ai-select {
  width: 100%;
  display: flex;
  flex-direction: column;

  &__input {
    display: flex;
    align-items: center;
    justify-content: center;

    border: solid 1px;
    border-radius: 5px;
    padding: 10px;
  }

  &__select {
    width: 100%;
    font-size: 14px;
    color: #4a4a4a;
    border: none;
    outline: none;
    background: #fff;

    -webkit-appearance: none;

    &:focus {
      outline: none;
      border: none;
      background: #fff;
    }
  }
}
</style>
