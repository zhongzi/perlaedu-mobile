<template>
  <div :class="b()">
    <ai-input-date :value="date" @input="updateDate" class="date" />
    <ai-input-time :value="time" @input="updateTime" class="time" />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

import AiInputDate from "./AiInputDate.vue";
import AiInputTime from "./AiInputTime.vue";

import isDate from "lodash/isDate";
import cloneDeep from "lodash/cloneDeep";

@Component({
  name: "ai-input-datetime",
  components: {
    AiInputDate,
    AiInputTime,
  },
})
export default class Home extends Vue {
  @Prop({ type: [String, Date], default: null }) value: any;

  get currentDate() {
    return isDate(this.value)
      ? this.value
      : (this.value && this.$options.filters.parseDate(this.value)) ||
          new Date();
  }

  get date() {
    return this.currentDate;
  }

  get time() {
    return this.$options.filters.date(this.currentDate, "HH:mm:ss");
  }

  updateDate(date) {
    date = cloneDeep(date);
    date.setHours(this.currentDate.getHours());
    date.setMinutes(this.currentDate.getMinutes());
    date.setSeconds(this.currentDate.getSeconds());
    console.log(date);
    this.$emit("input", date);
  }

  updateTime(time) {
    const date = cloneDeep(this.currentDate);
    date.setHours(parseInt(time[0]));
    date.setMinutes(parseInt(time[1]));
    date.setSeconds(parseInt(time[2]));
    console.log(date);
    this.$emit("input", date);
  }
}
</script>
<style lang="scss" scoped>
.ai-input-datetime {
  display: flex;
  align-items: center;
  justify-content: space-between;

  .date {
    flex: 5;
  }
  .time {
    flex: 3;
  }
}
</style>
