<template>
  <div :class="b()">
    <div :class="b('content')" @click="open = true">
      <span> {{ label }} </span>
      <span> {{ value | defaultDay }} </span>
      <i class="iconfont icon-riqi" />
    </div>
    <hui-popup-date-picker
      :show.sync="open"
      :value="value"
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

@Component({
  name: "ai-input-date",
})
export default class Home extends Mixins(PatchMixin) {
  @Prop({ type: Date, default: null }) value: any;
  @Prop({ type: String, default: "text" }) label: string;
  @Prop({ type: Number, default: null }) minYear: number;
  @Prop({ type: Number, default: null }) maxYear: number;

  get aYear() {
    return this.maxYear || new Date().getFullYear() + 5;
  }

  get iYear() {
    return this.minYear || new Date().getFullYear() - 5;
  }

  open: boolean = false;
}
</script>
<style lang="scss" scoped>
.ai-input-date {
  border: solid 1px;
  border-radius: 5px;
  padding: 10px;
  height: 24px;

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
  }
}
</style>
