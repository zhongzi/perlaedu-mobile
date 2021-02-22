<template>
  <div :class="[b(), b(mode)]">
    <div :class="b('label')" v-if="label">
      {{ label }}
    </div>
    <div :class="b('input')">
      <slot name="left"> </slot>
      <select
        :class="b('select')"
        v-model="innerValue"
        @blur="fixIOSScroll"
        :disabled="disabled"
      >
        <option
          v-if="defaultName"
          value=""
          :class="b('select-option')"
          :selected="'' === innerValue"
        >
          {{ defaultName }}
        </option>
        <template v-for="(option, index) in options">
          <option
            :value="option | safe(valueKey, option)"
            :key="index"
            :class="b('select-option')"
            :selected="
              $options.filters.safe(option, valueKey, option) === innerValue
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
  @Prop({ type: Boolean, default: false }) disabled: boolean;
  @Prop({ type: String, default: "" }) mode: string;
  @Prop({ type: String, default: null }) label: string;
  @Prop({ type: String, default: "key" }) labelKey: string;
  @Prop({ type: String, default: "value" }) valueKey: string;
  @Prop({ type: Boolean, default: false }) enableAllOption: boolean;
  @Prop({ type: Boolean, default: false }) enableUnsetOption: boolean;

  innerValue: any = null;

  get defaultName() {
    if (this.enableUnsetOption) return "暂不设置";
    if (this.enableAllOption) return "全部";
    return;
  }

  created() {
    this.resetDefaultValue();
  }

  @Watch("options", { deep: true })
  onOptionsChanged() {
    this.resetDefaultValue();
    this.emitValue();
  }

  @Watch("value", { deep: true })
  onValueChanged() {
    this.resetDefaultValue();
    this.emitValue();
  }

  @Watch("innerValue", { deep: true })
  onInnerValueChanged() {
    this.emitValue();
  }

  @Watch("disabled", { deep: true })
  onDisabledChanged() {
    this.emitValue();
  }

  resetDefaultValue() {
    this.innerValue = "" + this.value;

    if (!this.autoDefault) return;
    if (isEmpty(this.options)) return;
    if (!isEmpty(this.innerValue)) return;

    if (this.enableAllOption || this.enableUnsetOption) {
      this.innerValue = "";
    } else {
      this.innerValue = _get(this.options[0], this.valueKey, this.options[0]);
    }
  }

  getFilteredInnerValue() {
    if (
      !isEmpty(this.options) &&
      typeof this.options[0][this.valueKey] === "number"
    ) {
      return parseInt(this.innerValue);
    }
    return this.innerValue;
  }

  emitValue() {
    const filteredValue = this.getFilteredInnerValue();

    this.innerValue = "" + this.innerValue;
    const option = isEmpty(this.valueKey)
      ? this.innerValue
      : isEmpty(this.innerValue)
      ? {
          [this.labelKey]: this.defaultName,
          [this.valueKey]: this.innerValue,
        }
      : find(this.options, { [this.valueKey]: filteredValue });

    this.$emit("input", filteredValue);
    this.$emit("selected", option);
  }
}
</script>
<style lang="scss" scoped>
.ai-select__border {
  border: solid 1px;
  border-radius: 4px;
}

.ai-select__border-bottom {
  border-bottom: 1px solid #ededed;
}

.ai-select {
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 10px 0px;

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
    font-size: 14px;
    color: rgba(165, 165, 165, 1);
    outline: none;
    background: #fff;
    border-radius: 8px;
    border: none;

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
