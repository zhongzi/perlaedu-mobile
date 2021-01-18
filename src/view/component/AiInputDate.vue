<template>
  <div :class="b()">
    <div :class="b('content')" @click="open = true">
      <span> {{ label }} </span>
      <span> {{ value | defaultDay }} </span>
      <i class="iconfont icon-riqi" />
    </div>
    <hui-popup-date-picker
      :show.sync="open"
      :value="innerValue"
      :minYear="iYear"
      :maxYear="aYear"
      :enableFuture="true"
      @on-hide="open = false"
      @input="(v) => $emit('input', v)"
      title="选择日期"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Mixins } from "vue-property-decorator";

import PatchMixin from "@/mixin/PatchMixin";
import isDate from "lodash/isDate";

@Component({
  name: "ai-input-date",
})
export default class Home extends Mixins(PatchMixin) {
  @Prop({ type: [Date, String], default: null }) value: any;
  @Prop({ type: String, default: "" }) label: string;
  @Prop({ type: Number, default: null }) minYear: number;
  @Prop({ type: Number, default: null }) maxYear: number;

  open: boolean = false;

  get aYear() {
    return this.maxYear || new Date().getFullYear() + 5;
  }

  get innerValue() {
    return (
      (isDate(this.value)
        ? this.value
        : this.value && this.$options.filters.parseDate(this.value)) ||
      new Date()
    );
  }

  get iYear() {
    return this.minYear || new Date().getFullYear() - 5;
  }
}
</script>
<style lang="scss" scoped>
.ai-input-date {
  border: solid 1px;
  border-radius: 5px;
  padding: 10px;
  height: 48px;

  &__content {
    width: 100%;
    min-width: 100%;
    font-size: 14px;
    line-height: 1.5;
    color: #4a4a4a;
    display: flex;
    align-items: center;
    justify-content: space-between;

    margin: 0px;
    padding: 0px;

    span:nth-child(1) {
      color: rgba(74, 74, 74, 0.5);
    }
  }
}
</style>
