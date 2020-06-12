<template>
  <div :class="b()">
    <div :class="b('label')" v-if="label">
      {{ label }}
    </div>
    <div :class="b('input')">
      <select :class="b('select')" v-model="innerValue" @blur="fixIOSScroll">
        <template v-for="(option, index) in options">
          <option
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
        </template>
      </select>
      <slot name="right">
        <i class="iconfont icon-select" :class="b('icon')" />
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
  @Prop({ type: Boolean, default: true }) autoDefault: boolean;
  @Prop({ type: String, default: null }) label: string;
  @Prop({ type: String, default: "key" }) labelKey: string;
  @Prop({ type: String, default: "value" }) valueKey: string;

  innerValue: string | number = "";

  created() {
    this.emitDefaultValue();
  }

  @Watch("options", { deep: true })
  onOptionsChanged() {
    this.emitDefaultValue();
  }

  @Watch("value")
  onValueChanged() {
    this.resetInnerValue();
  }

  @Watch("innerValue")
  onInnerValueChanged() {
    this.emitValue();
  }

  emitDefaultValue() {
    if (!this.autoDefault) return;
    if (isEmpty(this.options)) return;
    if (!isEmpty(this.innerValue)) return;

    this.innerValue = _get(this.options[0], this.valueKey, this.options[0]);
    this.emitValue();
  }

  resetInnerValue() {
    if (isEqual(this.value, this.innerValue)) return;
    this.innerValue = this.value;
  }

  emitValue() {
    if (isEqual(this.innerValue, this.value)) return;

    this.$emit("input", this.innerValue);
  }
}
</script>
<style lang="scss" scoped>
.ai-select {
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 10px;

  &__label {
    font-size: 14px;
    font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
    font-weight: bold;
    color: rgba(84, 84, 84, 1);
    line-height: 19px;
    letter-spacing: 1px;
  }

  &__input {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__select {
    width: 100%;
    font-size: 14px;
    color: rgba(165, 165, 165, 1);
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
  &__icon {
    font-size: 10px;
  }
}
</style>
