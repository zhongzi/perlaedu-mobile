<template>
  <div class="wrapper notice">
    <framework>
      <template v-slot:switch>
        <ai-button-round @click.native="gotoEditing" class="action">
          <i class="iconfont icon-editing" />
          <span>发布通知</span>
        </ai-button-round>
      </template>
      <template v-slot:body>
        <overview :merchant="merchant" class="section section-overview" />
        <!--
        <ai-button-round class="cron-btn"> 定时循环通知 </ai-button-round>
-->
        <notices :merchant="merchant" class="section" />
      </template>
    </framework>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Mixins } from "vue-property-decorator";

import SyncMixin from "@/mixin/SyncMixin";

import AiButtonRound from "@/view/component/AiButtonRound.vue";

import Framework from "@/view/merchant/component/Framework.vue";

import Overview from "./component/admin/Overview.vue";
import Notices from "./component/admin/Notices.vue";

import _get from "lodash/get";

@Component({
  components: {
    AiButtonRound,
    Framework,
    Overview,
    Notices,
  },
})
export default class Home extends Mixins(SyncMixin) {
  merchantId: string = null;

  get merchant() {
    return this.entity;
  }

  created() {
    this.store = "merchant";
    this.resetMerchantId();
    this.$bus.$on("merchant:switched", (merchant) => {
      this.resetMerchantId(merchant.id);
    });
  }

  activated() {
    this.resetMerchantId();
  }

  resetMerchantId(merchantId = null) {
    this.merchantId =
      merchantId ||
      this.$route.query._merchant_id_ ||
      this.$auth.user.curr_merch_id;
    this.loadMerchant();
  }

  loadMerchant() {
    if (!this.merchantId) return;

    this.id = this.merchantId;
    this.loadEntity({
      query: {
        extras: JSON.stringify({
          Merchant: ["statistics"],
          MerchantStatistic: [
            "notice",
            "notice_recipient",
            "notice_recipient_log",
          ],
          NoticeStatistic: [
            "count",
            "count_running",
            "count_freezed",
            "count_stopped",
          ],
          NoticeRecipientStatistic: ["count", "count_success"],
          NoticeRecipientLogStatistic: ["count", "count_wechat"],
        }),
      },
    });
  }

  gotoEditing() {
    this.$router.push({
      name: "noticeEditing",
      params: {
        noticeId: "new",
      },
    });
  }
}
</script>
<style lang="scss" scoped>
.notice {
  .action {
    width: 100px;
    color: #e2630e;
    border: none;
    min-height: auto;
    padding: 10px 0px;
    margin-left: 10px;
  }
  .section-overview {
    margin-top: 20px;
    margin-bottom: 10px;
  }
  .cron-btn {
    margin: 10px auto 0px;
    padding: 5px 0px;
    width: 90vw;
    display: block;
    background: rgba(250, 142, 69, 1);
    border: none;
    font-size: 18px;
    font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
    font-weight: bold;
    color: rgba(255, 255, 255, 1);
    line-height: 19px;
    letter-spacing: 1px;
  }
}
</style>
