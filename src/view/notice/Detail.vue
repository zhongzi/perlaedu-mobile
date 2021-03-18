<template>
  <div class="wrapper notice-detail">
    <notice-cell :notice="notice" />
    <ai-tab v-model="curTabIdx" :tabs="tabs" class="tabs" />
    <notice-content :notice="notice" v-if="curTab.value === 'detail'" />
    <notices :query="queryNotice" v-if="curTab.value === 'cron'" />
    <notice-targets :value="targets" v-if="curTab.value === 'target'" />
    <notice-recipients
      v-if="curTab.value === 'recipient'"
      :query="queryRecipient"
    />
    <notice-recipient-logs :query="queryLog" v-if="curTab.value === 'log'" />
    <notice-interactions
      v-if="curTab.value === 'interaction'"
      :query="queryInteraction"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Mixins, Watch } from "vue-property-decorator";

import SyncMixin from "@/mixin/SyncMixin";

import AiTab from "@/view/component/AiTab.vue";
import AiCard from "@/view/component/AiCard.vue";

import NoticeCell from "./component/admin/NoticeCell.vue";

import Notices from "./component/admin/Notices.vue";
import NoticeContent from "./component/admin/NoticeContent.vue";
import NoticeTargets from "./component/admin/NoticeTargets.vue";
import NoticeRecipients from "./component/admin/NoticeRecipients.vue";
import NoticeRecipientLogs from "./component/admin/NoticeRecipientLogs.vue";
import NoticeInteractions from "./component/admin/NoticeInteractions.vue";

import _get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import concat from "lodash/concat";

@Component({
  components: {
    AiTab,
    AiCard,
    Notices,
    NoticeContent,
    NoticeCell,
    NoticeTargets,
    NoticeRecipients,
    NoticeRecipientLogs,
    NoticeInteractions,
  },
})
export default class Home extends Mixins(SyncMixin) {
  curTabIdx: number = 0;

  get notice() {
    return this.entity;
  }

  get targets() {
    return _get(this.notice, "targets");
  }

  get isManager() {
    const openid = _get(this.$auth, "user.openid");
    const isManager = _get(this.$auth, "user.is_manager");
    const merchantId = _get(this.$auth, "user.curr_merch_id");

    return (
      (isManager && merchantId === _get(this.notice, "merchant_id")) ||
      openid === _get(this.notice, "openid")
    );
  }

  get isCronNotice() {
    return !isEmpty(_get(this.notice, "cron"));
  }

  get tabs() {
    let tabs: any = [
      {
        label: "详情",
        value: "detail",
      },
      {
        label: "发送对象",
        value: "target",
      },
    ];
    if (this.isCronNotice) {
      tabs = concat(tabs, {
        label: "历史通知",
        value: "cron",
      });
    }
    tabs = concat(tabs, [
      {
        label: "发送明细",
        value: "recipient",
      },
      {
        label: "最新回复",
        value: "interaction",
      },
    ]);
    return tabs;
  }

  get curTab() {
    return this.tabs[this.curTabIdx];
  }

  get queryNotice() {
    return {
      source_id: this.notice.id,
      source_class: "Notice",
    };
  }

  get queryRecipient() {
    return {
      notice_id: this.notice.id,
    };
  }

  get queryTarget() {
    return {
      notice_id: this.notice.id,
    };
  }

  get queryLog() {
    return {
      notice_id: this.notice.id,
    };
  }

  get queryInteraction() {
    return {
      notice_id: this.notice.id,
    };
  }

  created() {
    this.store = "notice";
    this.load();
  }

  @Watch("$route", { deep: true })
  onRouteChanged() {
    this.load();
  }

  load() {
    this.id = parseInt(this.$route.params.noticeId);
    if (!this.id || this.id <= 0) return;

    this.loadEntity({
      query: {
        extras: JSON.stringify({
          Notice: ["template", "user", "attachments", "targets"],
          NoticeTarget: ["target"],
          MediaAttachment: ["media"],
          Media: ["url", "file"],
          OAuth: ["avatar"],
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
