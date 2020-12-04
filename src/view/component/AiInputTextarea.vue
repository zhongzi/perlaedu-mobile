<template>
  <div :class="b()">
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
  width: 100%;
  position: relative;
  padding: 10px;
  overflow-wrap: anywhere;

  &__input {
    width: 100%;
    min-height: 100px;
    border: none;
    background-color: rgba(255, 255, 255, 0);
    margin: 0px;
    padding: 0px;

    &:focus {
      outline: none;
    }

    &::placeholder {
      color: #9b9b9b;
    }
  }
}
</style>
