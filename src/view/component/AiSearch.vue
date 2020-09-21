<template>
  <div class="ai-search">
    <slot name="left">
      <span class="ai-search__header">
        <i class="iconfont icon-search" />
      </span>
    </slot>
    <input
      class="ai-search__input"
      v-model="innerValue"
      :placeholder="placeholder"
    />
    <slot name="right">
      <span class="ai-search__footer">
        <i class="iconfont icon-close" @click="innerValue = ''" />
      </span>
    </slot>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import isEqual from "lodash/isEqual";
import isEmpty from "lodash/isEmpty";
import trimStart from "lodash/trimStart";

@Component
export default class Home extends Vue {
  @Prop({ type: String, default: "" }) value: string;
  @Prop({ type: String, default: "请输入您要查询的内容" }) placeholder: string;

  innerValue: string = "";

  created() {
    this.resetInnerValue();
  }

  @Watch("value")
  onValueChanged() {
    this.resetInnerValue();
  }

  @Watch("innerValue")
  onInnerValueChanged() {
    this.$emit("input", this.innerValue);
  }

  resetInnerValue() {
    if (isEqual(this.innerValue, this.value)) return;

    this.innerValue = this.value;
  }
}
</script>
<style lang="scss" scoped>
.ai-search {
  display: flex;
  align-items: center;
  justify-content: space-around;

  height: 48px;
  padding: 0px 10px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 24px;
  border: 2px solid rgba(255, 255, 255, 0.37);

  i {
    font-size: 24px;
    color: #fff;
  }

  &__input {
    flex: 1;
    padding: 0px 5px;

    background: rgba(255, 255, 255, 0);
    border: none;
    color: #fff;
    font-size: 16px;

    &:focus {
      outline: none;
    }

    &::placeholder {
      color: rgba(255, 255, 255, 0.8);
    }
  }
}
</style>
