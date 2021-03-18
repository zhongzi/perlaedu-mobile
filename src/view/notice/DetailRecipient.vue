<template>
  <div class="wrapper notice-detail">
    <notice-cell :recipient="recipient" />
    <ai-tab v-model="curTabIdx" :tabs="tabs" class="tabs" />
    <notice-content v-if="curTab.value === 'detail'" :notice="notice" />
    <notice-interactions-by-recipient
      v-if="curTab.value === 'interaction'"
      scrollHeight="40vh"
      :recipient="recipient"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Mixins, Watch } from "vue-property-decorator";

import SyncMixin from "@/mixin/SyncMixin";

import AiTab from "@/view/component/AiTab.vue";

import NoticeCell from "@/view/user/student/component/NoticeCell.vue";

import NoticeContent from "./component/admin/NoticeContent.vue";
import NoticeInteractionsByRecipient from "./component/admin/NoticeInteractionsByRecipient.vue";

import _get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import concat from "lodash/concat";

@Component({
  components: {
    AiTab,
    NoticeContent,
    NoticeCell,
    NoticeInteractionsByRecipient,
  },
})
export default class Home extends Mixins(SyncMixin) {
  curTabIdx: number = 0;

  get recipient() {
    return this.entity;
  }

  get notice() {
    return _get(this.recipient, "notice");
  }

  get tabs() {
    return [
      {
        label: "详情",
        value: "detail",
      },
      {
        label: "最新回复",
        value: "interaction",
      },
    ];
  }

  get curTab() {
    return this.tabs[this.curTabIdx];
  }

  get queryInteraction() {
    return {
      recipient_id: this.recipient.id,
    };
  }

  created() {
    this.store = "noticeRecipient";
    this.load();
  }

  @Watch("$route", { deep: true })
  onRouteChanged() {
    this.load();
  }

  @Watch("recipient", { deep: true })
  onRecipientChanged() {
    this.setReaded();
  }

  setReaded() {
    const openid = _get(this.recipient, "target.openid");
    const openidSecond = _get(this.recipient, "target.openid_second");
    const isReaded = _get(this.recipient, "is_readed");
    const myself = this.$auth.user.openid;
    console.log(openid, openidSecond, myself, isReaded, this.recipient.id);
    if (!isReaded && (openid === myself || openidSecond === myself)) {
      this.saveEntity({
        res: {
          id: this.id,
          notice_id: this.recipient.notice_id,
          is_readed: true,
          readed_at: new Date(),
        },
      });
    }
  }

  load() {
    this.id = parseInt(this.$route.params.recipientId);
    if (!this.id || this.id <= 0) return;

    this.loadEntity({
      query: {
        extras: JSON.stringify({
          NoticeRecipient: ["target", "merchant", "notice", "source", "name"],
          NoticeTarget: ["target"],
          Notice: ["template", "attachments"],
          MediaAttachment: ["media"],
          Media: ["url", "file"],
          Merchant: ["website", "logo_url"],
        }),
      },
    });
  }
}
</script>
<style lang="scss" scoped>
.notice-detail {
  margin: 10px;
  .tabs {
    & ::v-deep .h-tab_title {
      font-size: 14px;
    }
  }
}
</style>
