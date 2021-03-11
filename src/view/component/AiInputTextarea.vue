<template>
  <div :class="b()">
    <div :class="b('label')" v-if="label">
      <slot>
        {{ label }}
      </slot>
    </div>
    <textarea
      ref="input"
      v-focus
      v-resize
      :rows="rows"
      :class="b('input')"
      :type="type"
      :placeholder="placeholder"
      :value="value"
      @blur="onBlur"
      @input="onInput"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Mixins, Watch } from "vue-property-decorator";

import PatchMixin from "@/mixin/PatchMixin";

@Component({
  name: "ai-input-textarea",
})
export default class Home extends Mixins(PatchMixin) {
  @Prop({ type: String, default: null }) label: string;
  @Prop({ type: [String, Number], default: "" }) value: string | number;
  @Prop({ type: String, default: "text" }) type: string;
  @Prop({ type: String, default: "请输入内容" }) placeholder: string;
  @Prop({ type: Number, default: 3 }) rows: number;

  onBlur() {
    this.$emit("onBlur");
    this.fixIOSScroll();
  }

  onInput(e) {
    e.target.style.height = "inherit";
    e.target.style.height = `${e.target.style.scrollHeight}px`;
    this.$emit("input", e.target.value);
  }
}
</script>
<style lang="scss" scoped>
.ai-input-textarea {
  display: flex;
  flex-direction: column;

  width: 100%;
  position: relative;
  overflow-wrap: anywhere;

  &__label {
    font-size: 14px;
    font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
    font-weight: bold;
    color: rgba(84, 84, 84, 1);
    line-height: 19px;
    letter-spacing: 1px;
  }

  &__input {
    width: 100%;
    min-height: 100px;
    border: none;
    background-color: rgba(255, 255, 255, 0);
    margin: 0px;
    padding: 0px;
    font-size: 13px;

    &:focus {
      outline: none;
    }

    &::placeholder {
      color: #9b9b9b;
    }
  }
}
</style>
