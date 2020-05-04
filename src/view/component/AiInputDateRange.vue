<template>
  <div :class="b()">
    <div :class="b('title')">
      选择日期范围
    </div>
    <div :class="b('quick')">
      <template v-for="type in types">
        <hui-button
          :type="curType === type ? 'primary' : 'default'"
          :key="type.name"
          @click.native="curType = type"
          :class="b('quick-item')"
        >
          {{ type.name }}
        </hui-button>
      </template>
      <div :class="b('detail')">
        <ai-input-date
          v-model="startDate"
          label="开始日期"
          :class="b('detail-item')"
        />
        <ai-input-date
          v-model="endDate"
          label="结束日期"
          :class="b('detail-item')"
        />
      </div>
    </div>
    <div :class="b('actions')">
      <ai-button-round @click.native="$emit('cancel')"> 取消 </ai-button-round>
      <ai-button-round @click.native="onClick"> 确定 </ai-button-round>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Mixins, Watch } from "vue-property-decorator";

import PatchMixin from "@/mixin/PatchMixin";

import startOfDay from "date-fns/startOfDay";
import endOfDay from "date-fns/endOfDay";
import startOfTomorrow from "date-fns/startOfTomorrow";
import endOfTomorrow from "date-fns/endOfTomorrow";
import startOfWeek from "date-fns/startOfWeek";
import endOfWeek from "date-fns/endOfWeek";
import startOfMonth from "date-fns/startOfMonth";
import endOfMonth from "date-fns/endOfMonth";
import startOfQuarter from "date-fns/startOfQuarter";
import endOfQuarter from "date-fns/endOfQuarter";
import startOfYear from "date-fns/startOfYear";
import endOfYear from "date-fns/endOfYear";
import addSeconds from "date-fns/addSeconds";
import addDays from "date-fns/addDays";

import isFunction from "lodash/isFunction";

import AiButtonRound from "@/view/component/AiButtonRound.vue";
import AiInputDate from "@/view/component/AiInputDate.vue";

@Component({
  name: "ai-input-date-range",
  components: {
    AiButtonRound,
    AiInputDate,
  },
})
export default class Home extends Mixins(PatchMixin) {
  @Prop({ type: Array, default: null }) value: any;
  @Prop({ type: Date, default: () => new Date() }) today: any;

  types: any = [
    {
      name: "今日",
      dateRange: (today) => {
        return [startOfDay(today), endOfDay(today)];
      },
    },
    {
      name: "昨日",
      dateRange: (today) => {
        return [addDays(startOfDay(today), 1), addDays(endOfDay(today), 1)];
      },
    },
    {
      name: "本周",
      dateRange: (today) => {
        return [
          startOfWeek(today, { weekStartsOn: 1 }),
          endOfWeek(today, { weekStartsOn: 1 }),
        ];
      },
    },
    {
      name: "本月",
      dateRange: (today) => {
        return [startOfMonth(today), endOfMonth(today)];
      },
    },
    {
      name: "本季度",
      dateRange: (today) => {
        return [startOfQuarter(today), endOfQuarter(today)];
      },
    },
    {
      name: "本年",
      dateRange: (today) => {
        return [startOfYear(today), endOfYear(today)];
      },
    },
  ];

  curType: any = null;
  startDate: Date = new Date();
  endDate: Date = new Date();

  @Watch("curType")
  onCurTypeChanged() {
    let range = isFunction(this.curType.dateRange)
      ? this.curType.dateRange(this.today)
      : this.curType.dateRange;
    range[1] = addSeconds(range[1], 1);
    this.startDate = range[0];
    this.endDate = range[1];
  }

  onClick() {
    if (!this.curType) {
      this.$hui.toast.info("请选择时间范围");
      return;
    }

    this.$emit("input", [this.startDate, this.endDate]);
    this.$emit("confirm", [this.startDate, this.endDate]);
    return;
  }
}
</script>
<style lang="scss" scoped>
.ai-input-date-range {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;

  &__title {
    font-size: 20px;
    font-weight: 600;
  }

  &__quick {
    &-item {
      margin: 10px;
      width: 25%;
    }
  }
  &__detail {
    &-item {
      margin: 10px;
    }
  }
  &__actions {
    display: flex;
    align-items: center;
    justify-content: space-around;
  }
}
</style>
