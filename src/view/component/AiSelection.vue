<template>
  <div :class="[b(), b(mode)]">
    <div :class="b('label')" v-if="label">
      {{ label }}
    </div>
    <div :class="b('input')">
      <select :class="b('select')" v-model="innerValue" @blur="fixIOSScroll">
        <option v-if="defaultName" value="" :class="b('select-option')">
          {{ defaultName }}
        </option>
        <template v-for="(option, index) in options">
          <option
            :value="option | safe(valueKey, option)"
            :key="index"
            :class="b('select-option')"
            :selected="
              $options.filters.safe(option, valueKey, option) === value
            "
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
import find from "lodash/find";
import cloneDeep from "lodash/cloneDeep";

@Component({
  name: "ai-select",
})
export default class Home extends Mixins(PatchMixin) {
  @Prop({ type: [String, Number], default: "" }) value: string | number;
  @Prop({ type: Array, default: [] }) options: any;
  @Prop({ type: Boolean, default: true }) autoDefault: boolean;
  @Prop({ type: String, default: "" }) mode: string;
  @Prop({ type: String, default: null }) label: string;
  @Prop({ type: String, default: "key" }) labelKey: string;
  @Prop({ type: String, default: "value" }) valueKey: string;
  @Prop({ type: Boolean, default: false }) enableAllOption: boolean;
  @Prop({ type: Boolean, default: false }) enableUnsetOption: boolean;

  innerValue: any = "";

  get defaultName() {
    if (this.enableUnsetOption) return "暂不设置";
    if (this.enableAllOption) return "全部";
    return;
  }

  created() {
    this.resetValue();
    this.emitValue();
  }

  @Watch("options", { deep: true })
  onOptionsChanged() {
    this.emitDefaultValue();
  }

  @Watch("value", { deep: true })
  onValueChanged() {
    console.log(this.value);
    if (isEqual(this.value, this.innerValue)) return;
    this.resetValue();
  }

  @Watch("innerValue", { deep: true })
  onInnerValueChanged() {
    this.emitValue();
  }

  emitDefaultValue() {
    if (!this.autoDefault) return;
    if (!isEmpty(this.value)) return;
    if (isEmpty(this.options)) return;

    if (this.enableAllOption || this.enableUnsetOption) {
      this.innerValue = "";
    } else {
      this.innerValue = _get(this.options[0], this.valueKey, this.options[0]);
    }
  }

  resetValue() {
    this.innerValue = cloneDeep(this.value);
    this.emitDefaultValue();
  }

  emitValue() {
    this.$emit("input", this.innerValue);

    const option = isEmpty(this.valueKey)
      ? this.innerValue
      : isEmpty(this.innerValue)
      ? {
          [this.labelKey]: this.defaultName,
          [this.valueKey]: this.innerValue,
        }
      : find(this.options, { [this.valueKey]: this.innerValue });
    this.$emit("selected", option);
  }
}
</script>
<style lang="scss" scoped>
.ai-select__border {
  border: solid 1px;
  border-radius: 4px;
}

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

    background: #fff;
    border-radius: 4px;
  }

  &__select {
    width: 100%;
    min-height: 40px;

    font-size: 14px;
    color: rgba(165, 165, 165, 1);
    border: none;
    outline: none;
    background: #fff;
    border-radius: 8px;

    -webkit-appearance: none;

    &:focus {
      outline: none;
      border: none;
      background: #fff;
    }
  }
  &__icon {
    font-size: 8px;
    color: #d8d8d8;
  }
}
</style>
