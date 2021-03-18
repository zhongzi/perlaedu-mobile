<template>
  <div :class="b()">
    <div :class="b('content')" @click="open = true">
      <span> {{ label }} </span>
      <span> {{ value }} </span>
      <i class="iconfont icon-clock" />
    </div>
    <hui-popup-picker
      :show.sync="open"
      :value="innerValue"
      :data="times"
      @on-hide="open = false"
      @input="updateValue"
      title="选择时间"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Mixins } from "vue-property-decorator";

import PatchMixin from "@/mixin/PatchMixin";

import forEach from "lodash/forEach";
import isEmpty from "lodash/isEmpty";
import isArray from "lodash/isArray";
import range from "lodash/range";

const xrange = (x) => forEach(range(x), (i) => ("0" + i).slice(-2));

@Component({
  name: "ai-input-time",
})
export default class Home extends Mixins(PatchMixin) {
  @Prop({ type: [Array, String], default: null }) value: any;
  @Prop({ type: String, default: "" }) label: string;
  @Prop({ type: Boolean, default: true }) enableHour: boolean;
  @Prop({ type: Boolean, default: true }) enableMinute: boolean;
  @Prop({ type: Boolean, default: true }) enableSeconds: boolean;

  open: boolean = false;

  get times() {
    const times = [];
    if (this.enableHour) {
      times.push(xrange(24));
    }
    if (this.enableMinute) {
      times.push(xrange(60));
    }
    if (this.enableSeconds) {
      times.push(xrange(60));
    }
    return times;
  }

  get innerValue() {
    if (isEmpty(this.value)) return;
    return isArray(this.value) ? this.value : this.value.split(":");
  }

  updateValue(v) {
    this.$emit("input", v);
  }
}
</script>
<style lang="scss" scoped>
.ai-input-time {
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
