<template>
  <div :class="b()">
    <div :class="b('input')" v-if="isEditingMode">
      <textarea
        ref="input"
        v-focus
        v-resize
        rows="1"
        :class="b('input-e')"
        :type="type"
        :placeholder="placeholder"
        :value="value"
        @blur="onBlur"
        @input="(e) => $emit('input', e.target.value)"
      />
    </div>
    <div v-else :class="b('label')" @click="isEditing = !isEditing">
      <div :class="b('label-tip')">
        <i class="iconfont icon-edit-line" />
        {{ tip }}
      </div>
      <div>
        {{ value }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Mixins, Watch } from "vue-property-decorator";

import PatchMixin from "@/mixin/PatchMixin";

@Component({
  name: "ai-input",
})
export default class Home extends Mixins(PatchMixin) {
  @Prop({ type: [String, Number], default: "" }) value: string | number;
  @Prop({ type: String, default: "text" }) type: string;
  @Prop({ type: String, default: "text" }) placeholder: string;
  @Prop({ type: String, default: "normal" }) mode: string;
  @Prop({ type: String, default: "点击修改" }) tip: string;

  isEditing: boolean = false;

  get isEditingMode() {
    return this.mode === "normal" || this.isEditing;
  }

  onBlur() {
    this.$emit("onBlur");
    this.isEditing = false;
    this.fixIOSScroll();
  }
}
</script>
<style lang="scss" scoped>
.ai-input {
  width: 100%;
  text-align: center;
  overflow-wrap: anywhere;

  &__input {
    &-e {
      width: 100%;
      border: none;
      background-color: rgba(255, 255, 255, 0);
      margin: 0px;
      padding: 0px;

      text-align: center;

      &:focus {
        outline: none;
      }

      &::placeholder {
        color: #9b9b9b;
      }
    }
  }
  &__label {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    &-tip {
      display: flex;
      align-items: center;
      justify-content: center;

      font-size: 9px;
      color: #9b9b9b;
      i {
        font-size: 14px;
        color: #9b9b9b;
      }
    }
  }
}
</style>
