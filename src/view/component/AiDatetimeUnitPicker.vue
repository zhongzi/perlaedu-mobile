<template>
  <div :class="b()">
    <i class="iconfont icon-direction-left" @click="prev" />
    <ai-slider
      class="list"
      :list="list"
      :options="sliderOptions"
      :enableSlideAfter="false"
    >
      <template v-slot:item="{ item }">
        <div
          :class="['item', { 'item-actived': curItem === item }]"
          @click="onClick(item)"
        >
          {{ item.name }}
        </div>
      </template>
    </ai-slider>
    <i class="iconfont icon-direction" @click="next" />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Mixins, Watch } from "vue-property-decorator";

import AiDatetimePickerQuick from "./AiDatetimePickerQuick.vue";
import AiSlider from "./AiSlider.vue";

import addDays from "date-fns/addDays";
import addWeeks from "date-fns/addWeeks";
import addMonths from "date-fns/addMonths";

import startOfDay from "date-fns/startOfDay"; // startOfDay(new Date());
import startOfYesterday from "date-fns/startOfYesterday"; // startOfYesterday(new Date());
import startOfWeek from "date-fns/startOfWeek"; // startOfWeek(new Date(), { weekStartsOn: 1});
import startOfMonth from "date-fns/startOfMonth"; // startOfMonth(new Date());
import startOfQuarter from "date-fns/startOfQuarter"; // startOfQuarter(new Date());
import startOfYear from "date-fns/startOfYear"; // startOfQuarter(new Date());

import endOfDay from "date-fns/endOfDay"; // endOfDay(new Date());
import endOfYesterday from "date-fns/endOfYesterday"; // endOfYesterday(new Date());
import endOfWeek from "date-fns/endOfWeek"; // endOfWeek(new Date(), { weekStartsOn: 1});
import endOfMonth from "date-fns/endOfMonth"; // endOfMonth(new Date());
import endOfQuarter from "date-fns/endOfQuarter"; // endOfQuarter(new Date());
import endOfYear from "date-fns/endOfYear"; // endOfYear(new Date());

import isEmpty from "lodash/isEmpty";

@Component({
  name: "ai-datetime-unit-picker",
  components: {
    AiSlider,
    AiDatetimePickerQuick,
  },
})
export default class Home extends Vue {
  @Prop({ type: Array, default: [] }) value: any;

  counter = 0;
  curItem: any = null;

  sliderOptions: any = {
    slidesPerView: 3,
    initialSlide: 0,
    freeMode: true,
  };

  get list() {
    return [
      {
        name: "月",
        unit: "month",
      },
      {
        name: "周",
        unit: "week",
      },
      {
        name: "日",
        unit: "day",
      },
    ];
  }

  created() {
    this.curItem = this.list[1];
    this.updateValue();
  }

  @Watch("counter")
  onCounterChanged() {
    this.updateValue();
  }

  prev() {
    this.counter -= 1;
    return;
  }

  next() {
    this.counter += 1;
    return;
  }

  onClick(item) {
    this.curItem = item;
    this.counter = 0;
    this.updateValue();
  }

  updateValue() {
    const today = new Date();
    if (this.curItem.unit === "day") {
      const day = addDays(today, this.counter);
      this.$emit("input", [startOfDay(day), endOfDay(day)]);
      return;
    }
    if (this.curItem.unit === "week") {
      const day = addWeeks(today, this.counter);
      this.$emit("input", [
        startOfWeek(day, { weekStartsOn: 1 }),
        endOfWeek(day, { weekStartsOn: 1 }),
      ]);
      return;
    }
    if (this.curItem.unit === "month") {
      const day = addMonths(today, this.counter);
      this.$emit("input", [startOfMonth(day), endOfMonth(day)]);
      return;
    }
  }
}
</script>
<style lang="scss" scoped>
.ai-datetime-unit-picker {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .list {
    width: calc(100% - 60px - 10px);
  }

  .item {
    padding: 3px;
    background: #fff;
    font-size: 12px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #4a4a4a;
    line-height: 18px;
    border-radius: 4px;
    margin: 3px;
    text-align: center;
  }

  .item-actived {
    background: linear-gradient(120deg, #ff9249 0%, #e2630e 100%);
    box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.1);

    font-size: 14px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #ffffff;
    line-height: 18px;
  }

  i {
    font-size: 13px;
    color: rgba(74, 74, 74, 0.29);
    background: #fff;
    padding: 5px 3px;
    text-align: center;
    width: 30px;
  }
}
</style>
