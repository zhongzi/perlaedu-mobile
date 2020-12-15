<template>
  <div class="wrapper floor-quick-work-entry">
    <floor title="常用功能">
      <div class="main">
        <template v-for="(data, index) in cellDatas">
          <div :key="index" class="cell" @click="openWork(data)">
            {{ data.title }}
          </div>
        </template>
      </div>
    </floor>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

import Floor from "./Floor.vue";

import _get from "lodash/get";

@Component({
  components: {
    Floor,
  },
})
export default class Home extends Vue {
  @Prop({ type: Object, default: null }) merchant: any;

  get cellDatas() {
    return [
      {
        title: "给班级学生排课",
        url: this.$frontURLResolver.listGroups(this.merchant),
      },
      {
        title: "给一对一学生排课",
        url: this.$frontURLResolver.getScheduleOnOne(this.merchant),
      },
      {
        title: "班级点名日志",
        url: this.$frontURLResolver.getGroupOprs(this.merchant),
      },
      {
        title: "班级历史消息",
        url: this.$frontURLResolver.getMessages(this.merchant),
      },
      {
        title: "请假申请记录",
        url: this.$frontURLResolver.getRequests(this.merchant),
      },
      {
        title: "请假明细",
        url: this.$frontURLResolver.getLeaveTag(this.merchant),
      },
      {
        title: "确认上课通知",
        url: this.$frontURLResolver.getTimelines(this.merchant),
      },
      {
        title: "全校通知",
        url: this.$frontURLResolver.getMessage(this.merchant),
      },
      {
        title: "在线课程",
        url: this.$frontURLResolver.getOnlineCourses(this.merchant),
      },
      {
        title: "预约上课",
        url: this.$frontURLResolver.getBookings(this.merchant),
      },
      {
        title: "Excel批量导入",
        url: this.$frontURLResolver.getImports(this.merchant),
      },
      {
        title: "定时任务提醒",
        url: this.$frontURLResolver.getAlarms(this.merchant),
      },
      {
        title: "手机号码绑定记录",
        route: {
          name: "merchantAuthorizations",
        },
      },
    ];
  }

  openWork(item) {
    if (item.url) {
      window.location.href = item.url;
    } else {
      this.$router.push(item.route);
    }
    return;
  }
}
</script>
<style lang="scss" scoped>
.floor-quick-work-entry {
  .main {
    display: flex;
    align-items: center;
    flex-wrap: wrap;

    .cell {
      background: #ffffff;
      border-radius: 4px;
      padding: 10px;

      width: 49%;
      margin-bottom: 10px;

      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #4a4a4a;
      line-height: 20px;

      &:not(:nth-child(2n)) {
        margin-right: 2%;
      }
    }
  }
}
</style>
