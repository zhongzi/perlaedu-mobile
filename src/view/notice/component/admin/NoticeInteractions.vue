<template>
  <div class="wrapper notice-interactions">
    <ly-search v-model="keyword" placeholder="微信昵称/学员姓名/员工姓名" />
    <ai-list-stored
      resource="noticeInteraction"
      scrollHeight="60vh"
      :query="innerQuery"
      :refresh.sync="refresh"
    >
      <template v-slot:item="{ item, tag }">
        <notice-interaction-cell
          :key="item.id"
          :interaction="item"
          class="interaction"
        >
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
              <ai-button class="action" @click.native="openAll(item, tag)">
                全部
              </ai-button>
            </div>
          </template>
        </notice-interaction-cell>
      </template>
    </ai-list-stored>
    <ai-dialog v-model="openDialog">
      <div class="dialog">
        <div class="target" v-if="targetInteraction">
          回复: #{{ targetInteraction.id }}
        </div>
        <ai-content-media-editor
          kind="notice"
          :content.sync="description"
          :medias.sync="medias"
          :enableTab="true"
        />
        <ai-submit-actions @cancel="openDialog = false" @submit="onSubmit" />
      </div>
    </ai-dialog>
    <notice-interactions-popup v-model="openPopup" :recipient="recipient" />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Mixins } from "vue-property-decorator";

import SyncMixin from "@/mixin/SyncMixin";

import AiDialog from "@/view/component/AiDialog.vue";
import AiButton from "@/view/component/AiButton.vue";
import AiSubmitActions from "@/view/component/AiSubmitActions.vue";
import AiListStored from "@/view/component/AiListStored.vue";
import AiContentMediaEditor from "@/view/component/AiContentMediaEditor.vue";
import LySearch from "@/view/layout/component/Search.vue";

import NoticeInteractionsPopup from "./NoticeInteractionsPopup.vue";
import NoticeInteractionCell from "./NoticeInteractionCell.vue";

import _get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import merge from "lodash/merge";
import cloneDeep from "lodash/cloneDeep";

@Component({
  components: {
    LySearch,
    AiDialog,
    AiButton,
    AiSubmitActions,
    AiListStored,
    AiContentMediaEditor,
    NoticeInteractionCell,
    NoticeInteractionsPopup,
  },
})
export default class Home extends Mixins(SyncMixin) {
  @Prop({ type: Object, default: null }) query: any;

  keyword: string = "";
  recipient: any = null;

  targetInteraction: any = null;
  description: string = "";
  medias: any = [];

  refresh: boolean = false;
  openDialog: boolean = false;
  openPopup: boolean = false;

  get openid() {
    return _get(this.$auth, "user.openid");
  }

  get innerQuery() {
    return merge(
      {
        keyword: this.keyword,
        extras: JSON.stringify({
          NoticeInteraction: [
            "user",
            "target",
            "latest_repley",
            "attachments",
            "recipient",
          ],
          OAuth: ["avatar_url"],
          MediaAttachment: ["media"],
          Media: ["file", "url"],
        }),
        sort: "id desc",
      },
      this.query || {}
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
          },
          failure: (err) => {
            this.$hui.toast.error(err.response.data.message);
          },
        });
      },
      onCancel: () => {},
    });
  }

  onSubmit() {
    if (isEmpty(this.description)) {
      this.$hui.toast.error("回复内容不可为空");
      return;
    }

    this.saveEntity({
      store: "noticeInteraction",
      res: {
        description: this.description,
        medias: this.medias,
        target_id: this.targetInteraction.id,
        target_class: "TargetInteraction",
        recipient_id: this.targetInteraction.recipient_id,
        notice_id: this.targetInteraction.notice_id,
        merchant_id: this.targetInteraction.merchant_id,
      },
      success: () => {
        this.$hui.toast.info("提交成功");
        this.refresh = true;
        this.openDialog = false;
      },
    });
  }

  onReply(item, tag) {
    this.targetInteraction = item;
    this.openDialog = true;
  }

  openAll(item, tag) {
    this.recipient = cloneDeep(item.recipient);
    this.openPopup = true;
  }
}
</script>
<style lang="scss" scoped>
.notice-interactions {
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

  .interaction {
    background: #fff;
    margin: 3px 0px;
    padding: 10px 5px 5px;
  }
}
.dialog {
  font-size: 13px;
  line-height: 1.5;
  padding: 10px;
}
</style>
