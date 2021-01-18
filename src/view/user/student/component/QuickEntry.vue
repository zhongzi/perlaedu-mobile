<template>
  <div class="wrapper quick-entry">
    <div class="title">常用功能</div>
    <div class="main">
      <template v-for="(data, index) in cellDatas">
        <div :key="index" class="cell" @click="openWork(data)">
          {{ data.title }}
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

import _get from "lodash/get";

@Component({
  components: {},
})
export default class Home extends Vue {
  @Prop({ type: Object, default: () => ({}) }) merchant: any;

  get cellDatas() {
    return [
      {
        title: "作业打卡",
        url: this.$frontURLResolver.homeworks(this.merchant),
      },
      {
        title: "预约上课",
        url: this.$frontURLResolver.booking(this.merchant),
      },
      {
        title: "课前请假",
        url: this.$frontURLResolver.askForLeave(this.merchant),
      },
      {
        title: "请假记录",
        url: this.$frontURLResolver.getRequests(),
      },
      {
        title: "重新绑定手机",
        route: {
          name: "PhoneVerifying",
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
.quick-entry {
  margin: 0px 25px;

  .title {
    font-size: 16px;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: rgba(74, 74, 74, 1);
    line-height: 3;
  }
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
