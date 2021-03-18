<template>
  <div class="wrapper overview">
    <div class="column">
      <div class="main">
        <span> 历史通知 </span>
        <div @click="$router.push({ name: 'notices' })">
          <span> {{ countNotice || 0 }} </span>
          <span> 条 </span>
        </div>
      </div>
      <div class="remark">
        <div class="row">待启动: {{ countPending }}</div>
        <div class="row">进行中: {{ countRunning }}</div>
      </div>
    </div>
    <div class="column">
      <div class="main">
        <span> 接收对象 </span>
        <div @click="$router.push({ name: 'noticeRecipients' })">
          <span> {{ countRecipient || 0 }} </span>
          <span> 人次 </span>
        </div>
      </div>
      <div class="remark">
        <div class="row">成功: {{ countSent }}</div>
        <div class="row">已读: {{ countReaded }}</div>
      </div>
    </div>
    <div class="column">
      <div class="main">
        <span> 发送明细 </span>
        <div @click="$router.push({ name: 'noticeRecipientLogs' })">
          <span> {{ countRecipientLog || 0 }} </span>
          <span> 条 </span>
        </div>
      </div>
      <div class="remark">
        <div class="row">微信: {{ countWechat }}</div>
        <div class="row">短信: {{ countRecipientLog - countWechat }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

import _get from "lodash/get";

@Component
export default class Home extends Vue {
  @Prop({ type: Object, default: null }) merchant: any;

  get countNotice() {
    return _get(this.merchant, "statistics.notice.count", 0);
  }

  get countPending() {
    return _get(this.merchant, "statistics.notice.count_pending", 0);
  }

  get countRunning() {
    return _get(this.merchant, "statistics.notice.count_running", 0);
  }

  get countFinished() {
    return _get(this.merchant, "statistics.notice.count_finished", 0);
  }
  get countRecipient() {
    return _get(this.merchant, "statistics.notice_recipient.count", 0);
  }
  get countSent() {
    return _get(this.merchant, "statistics.notice_recipient.count_success", 0);
  }
  get countReaded() {
    return _get(this.merchant, "statistics.notice_recipient.count_readed", 0);
  }
  get countRecipientLog() {
    return _get(this.merchant, "statistics.notice_recipient_log.count", 0);
  }
  get countWechat() {
    return _get(
      this.merchant,
      "statistics.notice_recipient_log.count_wechat",
      0
    );
  }
}
</script>
<style lang="scss" scoped>
.overview {
  display: flex;
  align-items: flex-start;
  justify-content: space-around;
  font-size: 11px;

  .column {
    display: flex;
    flex-direction: column;
    justify-content: center;

    .main {
      display: flex;
      flex-direction: column;
      align-items: center;
      font-size: 12px;
      line-height: 1;

      div span:nth-child(1) {
        font-size: 24px;
        font-weight: 800;
        line-height: 1.5;
      }
    }

    .remark {
      display: flex;
      flex-direction: column;
      line-height: 1.2;
      color: #9b9b9b;
    }
  }
}
</style>
