<template>
  <div class="wrapper recipient-cell">
    <ai-panel open.sync="open" :showIcon="false" class="recipient">
      <template v-slot:header>
        <ai-cell class="info">
          <template v-slot:avatar>
            <img :src="avatar" class="avatar" />
          </template>
          <template v-slot:title>
            <span class="title"> {{ name }} </span>
          </template>
          <template v-slot:subtitle v-if="content">
            <span class="content"> {{ content }} </span>
          </template>
          <template v-slot:remark>
            <div class="is-sent">
              {{ isSent ? "发送成功" : sentAt ? "发送失败" : "未发送" }}
              <span class="datetime" v-if="sentAt">
                时间: {{ sentAt | defaultDate }}
              </span>
            </div>
            <div class="is-sent">
              {{ isReaded ? "已读" : "未读" }}
              <span class="datetime" v-if="readedAt">
                时间: {{ readedAt | defaultDate }}
              </span>
            </div>
          </template>
          <template v-slot:right>
            <ai-button @click.native.stop="openPopup = true">
              沟通记录
            </ai-button>
          </template>
        </ai-cell>
      </template>
      <div class="detail">
        <div class="receiver" v-if="firstReceiver">
          <div class="title">第一联系人</div>
          <div class="logs">
            <template v-for="log in firstReceiver.wechat">
              <div :key="log.id">
                <span>微信推送</span>
                <span> {{ log | safe("user.nickname") }} </span>
                <span> {{ log.batch_id }} </span>
                <span> {{ log.is_sent ? "发送成功" : "发送失败" }} </span>
                <span> {{ log.sent_at | defaultDate }} </span>
              </div>
            </template>
            <template v-for="log in firstReceiver.sms">
              <div :key="log.id">
                <span>短信推送</span>
                <span> {{ log.phone }} </span>
                <span> {{ log.batch_id }} </span>
                <span> {{ log.is_sent ? "发送成功" : "发送失败" }} </span>
                <span> {{ log.sent_at | defaultDate }} </span>
              </div>
            </template>
          </div>
        </div>
        <div class="receiver" v-if="secondReceiver">
          <div class="title">第二联系人</div>
          <div class="logs">
            <template v-for="log in secondReceiver.wechat">
              <div :key="log.id">
                <span>微信推送</span>
                <span> {{ log | safe("user.nickname") }} </span>
                <span> {{ log.batch_id }} </span>
                <span> {{ log.is_sent ? "发送成功" : "发送失败" }} </span>
                <span> {{ log.sent_at | defaultDate }} </span>
              </div>
            </template>
            <template v-for="log in secondReceiver.sms">
              <div :key="log.id">
                <span>短信推送</span>
                <span> {{ log.phone }} </span>
                <span> {{ log.batch_id }} </span>
                <span> {{ log.is_sent ? "发送成功" : "发送失败" }} </span>
                <span> {{ log.sent_at | defaultDate }} </span>
              </div>
            </template>
          </div>
        </div>
      </div>
    </ai-panel>
    <notice-interactions-popup v-model="openPopup" :recipient="recipient" />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

import AiCell from "@/view/component/AiCell.vue";
import AiButton from "@/view/component/AiButton.vue";
import AiPanel from "@/view/component/AiPanel.vue";

import NoticeInteractionsPopup from "./NoticeInteractionsPopup.vue";

import { PersonRole } from "@/enum/person_role";

import _get from "lodash/get";
import forEach from "lodash/forEach";
import isEmpty from "lodash/isEmpty";
import filter from "lodash/filter";

@Component({
  components: {
    AiCell,
    AiButton,
    AiPanel,
    NoticeInteractionsPopup,
  },
})
export default class Home extends Vue {
  @Prop({ type: Object, default: null }) recipient: any;

  open: boolean = false;
  openPopup: boolean = false;

  get isOAuth() {
    return _get(this.recipient, "target_class") === "OAuth";
  }

  get isReaded() {
    return _get(this.recipient, "is_readed");
  }

  get readedAt() {
    return _get(this.recipient, "readed_at");
  }

  get isSent() {
    return _get(this.recipient, "is_sent");
  }

  get query() {
    return {
      recipient_id: _get(this.recipient, "id"),
    };
  }

  get sentAt() {
    return _get(this.recipient, "sent_at");
  }

  get roles() {
    if (this.isOAuth) return ["校长"];

    const roles = [];
    const role = _get(this.recipient, "target.role", 0);
    forEach(PersonRole, (v) => {
      if ((role & v.value) > 0) {
        roles.push(v.text);
      }
    });
    return roles.reverse();
  }

  get name() {
    return (
      _get(this.recipient, "target.nickname") ||
      _get(this.recipient, "target.realname")
    );
  }

  get avatar() {
    return (
      _get(this.recipient, "target.avatar_url") ||
      _get(this.recipient, "target.avatar_url")
    );
  }

  get content() {
    const content = _get(this.recipient, "content");
    return isEmpty(content) ? null : content;
  }

  get logs() {
    return _get(this.recipient, "logs") || [];
  }

  get firstReceiver() {
    const phone = _get(this.recipient, "target.phone");
    const openid = _get(this.recipient, "target.openid");
    return this.getLogs(openid, phone);
  }

  get secondReceiver() {
    const phone = _get(this.recipient, "target.phone_second");
    const openid = _get(this.recipient, "target.openid_second");
    if (!this.isOAuth || (isEmpty(phone) && isEmpty(openid))) {
      return;
    }
    return this.getLogs(openid, phone);
  }

  getLogs(openid, phone) {
    const wechatLogs = filter(this.logs, (log) => {
      return log.openid === openid;
    });
    const smsLogs = filter(this.logs, (log) => {
      return log.phone === phone;
    });
    if (isEmpty(wechatLogs) && isEmpty(smsLogs)) {
      return;
    }
    return { wechat: wechatLogs, sms: smsLogs };
  }
}
</script>
<style lang="scss" scoped>
.recipient-cell {
  width: 100%;
  .recipient {
    margin: 5px auto;
    .info {
      padding: 5px;
    }
    .detail {
      padding: 5px;
    }
  }
}
</style>
