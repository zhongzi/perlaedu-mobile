<template>
  <div :class="[b(), b(mode)]">
    <div :class="b('label')" v-if="label">
      <slot>
        {{ label }}
      </slot>
    </div>
    <input
      ref="input"
      :class="b('input')"
      :type="type"
      :placeholder="placeholder"
      :value="value"
      @blur="onBlur"
      @input="(e) => $emit('input', e.target.value)"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Mixins, Watch } from "vue-property-decorator";

import PatchMixin from "@/mixin/PatchMixin";

@Component({
  name: "ai-input",
})
export default class Home extends Mixins(PatchMixin) {
  @Prop({ type: String, default: null }) label: string;
  @Prop({ type: [String, Number], default: "" }) value: string | number;
  @Prop({ type: String, default: "text" }) type: string;
  @Prop({ type: String, default: "text" }) placeholder: string;
  @Prop({ type: String, default: "" }) mode: string;

  onBlur() {
    this.fixIOSScroll();
  }
}
</script>
<style lang="scss" scoped>
.ai-input__border {
  border: solid 1px;
  border-radius: 5px;
}

.ai-input {
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
    width: 100%;
    min-width: 100%;
    font-size: 14px;
    line-height: 1.5;
    color: #4a4a4a;
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
