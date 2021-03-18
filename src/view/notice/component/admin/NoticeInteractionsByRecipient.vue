<template>
  <div class="wrapper notice-recipients-popup">
    <div class="title" v-if="showTitle">
      与 {{ recipientName }} 沟通历史记录
    </div>
    <ai-list-stored
      resource="noticeInteraction"
      :scrollHeight="scrollHeight"
      :query="query"
      :refresh.sync="refresh"
    >
      <template v-slot:item="{ item, tag }">
        <notice-interaction-cell :key="item.id" :interaction="item">
          <template v-slot:actions>
            <div class="actions">
              <ai-button
                class="action"
                @click.native="onDelete(item, tag)"
                v-if="item.openid === openid"
              >
                删除
              </ai-button>
              <ai-button
                class="action"
                @click.native="onReply(item, tag)"
                v-if="item.openid !== openid"
              >
                回复
              </ai-button>
              <ai-button
                class="action"
                @click.native="onEdit(item, tag)"
                v-if="item.openid === openid"
              >
                修改
              </ai-button>
            </div>
          </template>
        </notice-interaction-cell>
      </template>
    </ai-list-stored>
    <ai-fixed-footer style="background: #fff">
      <div class="reply">
        <div class="reply-target" v-if="targetInteraction">
          回复: #{{ targetInteraction.id }}
        </div>
        <ai-content-media-editor
          kind="notice"
          :content.sync="description"
          :medias.sync="medias"
          :enableTab="true"
          class="reply-editor"
        />
        <ai-submit-actions @cancel="close" @submit="onSubmit">
          提交
        </ai-submit-actions>
      </div>
    </ai-fixed-footer>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Mixins, Watch } from "vue-property-decorator";

import SyncMixin from "@/mixin/SyncMixin";

import AiButton from "@/view/component/AiButton.vue";
import AiSubmitActions from "@/view/component/AiSubmitActions.vue";
import AiListStored from "@/view/component/AiListStored.vue";
import AiFixedFooter from "@/view/component/AiFixedFooter.vue";
import AiContentMediaEditor from "@/view/component/AiContentMediaEditor.vue";

import NoticeInteractionCell from "./NoticeInteractionCell.vue";

import _get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import merge from "lodash/merge";
import forEach from "lodash/forEach";

@Component({
  components: {
    AiButton,
    AiSubmitActions,
    AiListStored,
    AiFixedFooter,
    AiContentMediaEditor,
    NoticeInteractionCell,
  },
})
export default class Home extends Mixins(SyncMixin) {
  @Prop({ type: Object, default: null }) recipient: any;
  @Prop({ type: Boolean, default: false }) showTitle: boolean;
  @Prop({ type: String, default: "60vh" }) scrollHeight: string;

  curTag: string = "";
  targetInteraction: any = null;
  currentInteraction: any = null;

  refresh: boolean = true;
  description: string = "";
  medias: any = [];

  get openid() {
    return _get(this.$auth, "user.openid");
  }

  get recipientName() {
    return (
      _get(this.recipient, "target.nickname") ||
      _get(this.recipient, "target.realname")
    );
  }

  get query() {
    return {
      recipient_id: _get(this.recipient, "id"),
      extras: JSON.stringify({
        NoticeInteraction: ["user", "target", "latest_repley", "attachments"],
        OAuth: ["avatar_url"],
        MediaAttachment: ["media"],
        Media: ["file", "url"],
      }),
      sort: "id desc",
    };
  }

  @Watch("currentInteraction", { deep: true })
  onCurrentInteractionChanged() {
    this.description = _get(this.currentInteraction, "description", "");
    this.medias = forEach(
      _get(this.currentInteraction, "attachments", []),
      (attachment) => {
        return attachment.media;
      }
    );
  }

  onDelete(item, tag) {
    this.$hui.confirm.show({
      title: "删除确认",
      message: `是否确认删除本条回复? 本操作不可恢复，请谨慎操作!`,
      confirmText: "确认",
      cancelText: "取消",
      onConfirm: () => {
        this.deleteEntity({
          tag: tag,
          store: "noticeInteraction",
          id: item.id,
          success: () => {
            this.$hui.toast.info("删除成功");
            this.refresh = true;
          },
          failure: (err) => {
            this.$hui.toast.error(err.response.data.message);
          },
        });
      },
      onCancel: () => {},
    });
  }

  onReply(item, tag) {
    this.currentInteraction = null;
    this.targetInteraction = item;
    this.curTag = tag;
  }

  onEdit(item, tag) {
    this.currentInteraction = item;
    this.targetInteraction = null;
    this.curTag = tag;
  }

  close(flag = false) {
    this.$emit("input", flag);
  }

  onSubmit() {
    if (isEmpty(this.description) && isEmpty(this.medias)) {
      this.$hui.toast.info("回复内容不可为空");
      return;
    }

    const id = _get(this.currentInteraction, "id");
    this.saveEntity({
      tag: this.curTag,
      store: "noticeInteraction",
      id: id,
      res: {
        id: id || undefined,
        description: this.description,
        medias: this.medias,
        recipient_id: this.recipient.id,
        notice_id: this.recipient.notice_id,
        merchant_id: this.recipient.merchant_id,
        target_id: _get(this.targetInteraction, "id"),
        target_class: "NoticeInteraction",
      },
      success: (resp) => {
        this.refresh = true;
        this.$hui.toast.info("提交成功");
        this.currentInteraction = null;
        this.targetInteraction = null;
      },
    });
  }
}
</script>
<style lang="scss" scoped>
.notice-recipients-popup {
  padding: 0px 10px;
  .title {
    font-size: 18px;
    font-weight: 800;
    line-height: 3;
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

.reply {
  padding: 0px 10px;
  text-align: left;

  &-target {
    font-size: 13px;
    text-align: left;
  }
}
</style>
