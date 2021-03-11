<template>
  <div class="wrapper job-count-down">
    <div class="time" :style="mergedStyle">
      {{ countDownTime }}
    </div>
    <div class="title">
      {{ remark }}
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

import AiListStored from "@/view/component/AiListStored.vue";

import CrmClue from "./CrmClue.vue";

import addDays from "date-fns/addDays";
import merge from "lodash/merge";
import isEmpty from "lodash/isEmpty";
import _get from "lodash/get";

@Component({
  components: {
    AiListStored,
    CrmClue,
  },
})
export default class Home extends Vue {
  @Prop({ type: Object, default: null }) customer: any;

  interver: any = null;
  countDownTime: string = "-";

  get job() {
    return _get(this.customer, "job");
  }

  get jobStage() {
    return _get(this.customer, "job_stage");
  }

  get remark() {
    if (_get(this.customer, "status") === "finished") {
      return this.customer.tags.split(",")[0];
    }
    if (_get(this.customer, "status") === "following") {
      return _get(this.job, "title");
    }
    return "";
  }

  get mergedStyle() {
    return this.jobStage
      ? {
          color: "#" + this.jobStage.color,
          borderBottomWidth: "10px",
          borderBottomStyle: "solid",
          borderBottomColor: "#" + this.jobStage.color,
        }
      : {};
  }

  get startDatetime() {
    const job = _get(this.customer, "job");
    if (isEmpty(job)) return;

    // const startDatetime = _get(this.customer, "job_at");
    // if (isEmpty(startDatetime)) return;

    // return addDays(
    //   this.$options.filters.parseDate(startDatetime),
    //   job.duration
    // );
    return _get(this.customer, "job_at");
  }

  created() {
    this.interver = setInterval(this.setCountDownTitle, 1000);
  }

  beforeDestory() {
    if (this.interver) {
      clearInterval(this.interver);
    }
  }

  setCountDownTitle() {
    if (_get(this.customer, "status") === "finished") {
      this.countDownTime = "已经关闭";
      return;
    }
    if (isEmpty(_get(this.customer, "follower_openid"))) {
      this.countDownTime = "等待分配";
      return;
    }

    const dist = this.$options.filters.distanceFromDatetime(
      this.startDatetime,
      false,
      true
    );
    this.countDownTime = "";
    if (dist.seconds <= 0) {
      this.countDownTime = "已过期";
      return;
    }
    if (dist.d > 0) {
      const isReturn = !isEmpty(this.countDownTime);
      this.countDownTime += dist.d + "天";
      if (isReturn) {
        return;
      }
    }
    if (dist.h > 0) {
      const isReturn = !isEmpty(this.countDownTime);
      this.countDownTime += dist.h + "小时";
      if (isReturn) {
        return;
      }
    }
    if (dist.m > 0) {
      const isReturn = !isEmpty(this.countDownTime);
      this.countDownTime += dist.m + "分钟";
      if (isReturn) {
        return;
      }
    }

    this.countDownTime += dist.s + "秒";
  }
}
</script>
<style lang="scss" scoped>
.job-count-down {
  line-height: 1;

  .time {
    font-size: 12px;
    font-weight: 600;
    text-align: center;
    padding-bottom: 5px;
    margin-bottom: 5px;
  }
  .title {
    font-size: 10px;
    text-align: center;
    color: #8c9aa8;

    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 70px;
  }
}
</style>
