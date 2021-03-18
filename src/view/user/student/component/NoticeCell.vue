<template>
  <ai-card class="wrapper notice-cell">
    <template v-slot:header>
      <div class="header">
        <span> 类型: {{ templateName }} </span>
        <div class="read">
          <ai-badge v-if="!isInDetail" :content="studentName" color="green" />
        </div>
      </div>
    </template>
    <template v-slot:body>
      <ai-cell class="body">
        <template v-slot:cover>
          <div class="cover">
            <img
              v-if="cover"
              :src="cover | alioss({ width: 128 })"
              class="cover"
            />
          </div>
        </template>
        <template v-slot:title>
          <span>{{ title }} </span>
          <ai-badge
            style="font-size: 12px"
            :content="isReaded ? '已读' : '未读'"
            :color="isReaded ? 'green' : 'red'"
          />
        </template>
        <template v-slot:subtitle>
          <span>{{ createdAt | defaultDate }} </span>
        </template>
        <template v-slot:remark>
          <div class="merchant" @click.stop="gotoWebsite">
            <img :src="merchantLogo" />
            <span> {{ merchantName }} </span>
          </div>
        </template>
        <template v-slot:right>
          <ai-button v-if="isInDetail">
            {{ studentName }}
          </ai-button>
          <div v-else class="actions">
            <ai-button class="action" @click.native="openDetail">
              查看
            </ai-button>
            <ai-button class="action" v-if="link" @click.native="openLink">
              外链
            </ai-button>
          </div>
        </template>
      </ai-cell>
    </template>
  </ai-card>
</template>

<script lang="ts">
import { Component, Vue, Prop, Mixins } from "vue-property-decorator";

import SyncMixin from "@/mixin/SyncMixin";

import AiButton from "@/view/component/AiButton.vue";
import AiCell from "@/view/component/AiCell.vue";
import AiBadge from "@/view/component/AiBadge.vue";
import AiCard from "@/view/component/AiCard.vue";

import { NoticeStatus, NoticeChannel } from "@/enum/notice";

import _get from "lodash/get";
import merge from "lodash/merge";
import isEmpty from "lodash/isEmpty";

@Component({
  components: {
    AiButton,
    AiCell,
    AiCard,
    AiBadge,
  },
})
export default class Home extends Mixins(SyncMixin) {
  @Prop({ type: Object, default: null }) recipient: any;

  get isInDetail() {
    return this.$route.name === "noticeRecipient";
  }

  get notice() {
    return _get(this.recipient, "notice");
  }

  get merchant() {
    return _get(this.recipient, "merchant");
  }

  get templateName() {
    return _get(this.notice, "template.title");
  }

  get merchantLogo() {
    return _get(this.merchant, "logo_url");
  }

  get merchantName() {
    return _get(this.merchant, "name");
  }

  get studentName() {
    return _get(this.recipient, "name");
  }

  get readedAt() {
    return _get(this.recipient, "readed_at");
  }

  get isReaded() {
    return this.isInDetail || _get(this.recipient, "is_readed");
  }

  get cover() {
    return _get(this.notice, "cover");
  }

  get title() {
    return _get(this.notice, "title");
  }

  get link() {
    const link = _get(this.notice, "link");
    return isEmpty(link) ? null : link;
  }

  get createdAt() {
    return _get(this.recipient, "created_at");
  }

  get source() {
    const target = _get(this.recipient, "source");
    if (isEmpty(target)) return;

    if (target.target_id === 0) return target.target_class;
    if (target.target_class === "Merchant") return "全校";
    if (target.target_class === "Group") return _get(target, "target.name");
    return;
  }

  openLink() {
    window.location.href = this.link;
  }

  openDetail() {
    this.$router.push({
      name: "noticeRecipient",
      params: {
        recipientId: this.recipient.id,
      },
    });
  }

  gotoWebsite() {
    if (_get(this.merchant, "website")) {
      this.$router.push({
        name: "websiteMerchant",
        params: {
          merchantId: this.merchant.id,
        },
      });
    }
  }
}
</script>
<style lang="scss" scoped>
.notice-cell {
  padding: 10px;
  margin: 10px auto;

  .header {
    width: 100%;

    font-size: 12px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;

    .read {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }

  .body {
    align-items: start;
    .ai-cell__left {
      align-items: start;
    }

    .cover {
      i {
        font-size: 24px;
      }
    }

    .merchant {
      display: flex;
      align-items: center;

      img {
        display: block;
        width: 20px;
        border-radius: 8px;
        margin-right: 10px;
      }
      span {
        font-size: 12px;
        color: #928e8e;
        line-height: 1.2;
      }
    }

    .actions {
      display: flex;
      flex-direction: column;

      .action {
        height: auto;
        font-size: 12px;
        padding-top: 5px;
        padding-bottom: 5px;
        margin: 2px auto;
      }
    }
  }
}
</style>
