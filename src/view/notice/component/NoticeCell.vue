<template>
  <div class="wrapper notice-cell">
    <div class="header">
      <div class="header-title">
        <span> {{ notice.id }} </span>
        <span> {{ title || merchantName }} </span>
      </div>
      <div v-if="title" class="merchant">{{ merchantName }}</div>
    </div>
    <notice-recipients :notice="notice" @selected="onSelected" />
    <div class="title"># {{ notice.title }}</div>
    <div class="content">
      <ai-content-media :content="description" :medias="medias" />
    </div>
    <div class="remark">
      <span class="time"> {{ (sentAt || createdAt) | defaultDate }} </span>
      <span class="reply" @click="reply()">
        <i class="iconfont icon-message" /> 评论
      </span>
    </div>
    <notice-interactions
      :recipient="recipient"
      v-if="recipient"
      :albums="albums"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

import AiContentMedia from "@/view/component/AiContentMedia.vue";

import NoticeRecipients from "./NoticeRecipients.vue";
import NoticeInteractions from "./NoticeInteractions.vue";

import _get from "lodash/get";
import find from "lodash/find";
import filter from "lodash/filter";
import isEmpty from "lodash/isEmpty";
import map from "lodash/map";
import merge from "lodash/merge";
import concat from "lodash/concat";

@Component({
  components: {
    AiContentMedia,
    NoticeRecipients,
    NoticeInteractions,
  },
})
export default class Home extends Vue {
  @Prop({ type: Object, default: null }) notice: any;

  recipient: any = null;

  get targetGroups() {
    return filter(
      _get(this.notice, "targets", []),
      (target) => target.target_class === "Group"
    );
  }

  get targetTags() {
    return filter(
      _get(this.notice, "targets", []),
      (target) => target.target_id === 0
    );
  }

  get targetMerchants() {
    return filter(
      _get(this.notice, "targets", []),
      (target) => target.target_class === "Merchant"
    );
  }

  get albums() {
    return concat(
      map(this.targetGroups, (target) =>
        merge(target.target, { _resource: "Group" })
      ),
      map(this.targetTags, (target) => {
        return { title: target.target_class, _resource: "Course" };
      })
    );
  }

  get title() {
    if (
      isEmpty(this.targetTags) &&
      isEmpty(this.targetMerchants) &&
      !isEmpty(this.targetGroups) &&
      this.targetGroups.length === 1
    ) {
      return _get(this.targetGroups, "[0].target.name");
    }
  }

  get merchantName() {
    return _get(this.notice, "merchant.name");
  }

  get description() {
    return _get(this.notice, "description");
  }

  get medias() {
    return map(_get(this.notice, "attachments") || [], (attachment) => {
      return attachment.media;
    });
  }

  get createdAt() {
    return _get(this.notice, "created_at");
  }

  get sentAt() {
    return _get(this.notice, "sent_at");
  }

  reply() {
    this.$bus.$emit("show:popup:reply", this.recipient);
  }

  onSelected(recipient) {
    this.recipient = recipient;
  }
}
</script>
<style lang="scss" scoped>
.notice-cell {
  width: 100%;

  .header {
    margin: 10px 0px;

    .merchant {
      font-size: 13px;
      color: #4a4a4a;
      letter-spacing: 1px;
      margin-top: 3px;
    }

    &-title {
      display: flex;
      align-items: center;

      span:nth-child(1) {
        padding: 3px 7px;
        background: #fa8e45;
        border-radius: 6px 6px 0px 6px;
        font-size: 14px;
        font-family: SourceHanSans-Bold, SourceHanSans;
        font-weight: bold;
        color: #ffffff;
        line-height: 18px;
      }
      span:nth-child(2) {
        margin-left: 5px;
        font-size: 14px;
        font-weight: 800;
        color: #545454;
        line-height: 19px;
        letter-spacing: 1px;
      }
    }
  }

  .title {
    font-size: 14px;
    color: #4a4a4a;
    font-weight: 500;
    line-height: 2;
    letter-spacing: 1px;
  }

  .remark {
    display: flex;
    align-items: enter;
    justify-content: space-between;

    .time {
      font-size: 13px;
      color: #4a4a4a;
      line-height: 2;
    }

    .reply {
      font-size: 13px;
      color: #4a4a4a;
      line-height: 2;
      font-weight: 500;
    }
  }
}
</style>
