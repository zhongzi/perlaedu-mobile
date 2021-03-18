<template>
  <div class="wrapper notice-interactions">
    <ai-list-stored
      v-if="recipient && recipient.id"
      class="content"
      resource="noticeInteraction"
      scrollType=""
      :limit="100"
      :enableMoreData="true"
      :query="innerQuery"
      :refresh.sync="refresh"
      :hideIfNoData="true"
      @emit-list="updateList"
    >
      <template v-slot:item="{ item }">
        <notice-interaction-cell
          :key="item.id"
          :interaction="item"
          @click.native="showActions(item)"
          :albums="innerAlbums"
        />
      </template>
    </ai-list-stored>
    <ai-popup v-model="openActions" :full="false" position="bottom">
      <div class="actions">
        <template v-for="(action, index) in actions">
          <div class="action" :key="index" @click="action.onClick()">
            {{ action.label }}
          </div>
        </template>
      </div>
    </ai-popup>
    <ai-popup
      v-model="openReply"
      :full="false"
      position="bottom"
      class="editor"
    >
      <div class="editor-content">
        <ai-content-media-editor
          :content.sync="description"
          :medias.sync="medias"
          :enableTab="true"
        />
        <ai-submit-actions @cancel="onCancel" @submit="onSubmit" />
      </div>
    </ai-popup>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Mixins, Watch } from "vue-property-decorator";

import SyncMixin from "@/mixin/SyncMixin";

import AiPopup from "@/view/component/AiPopup.vue";
import AiListStored from "@/view/component/AiListStored.vue";
import AiContentMediaEditor from "@/view/component/AiContentMediaEditor.vue";
import AiSubmitActions from "@/view/component/AiSubmitActions.vue";

import NoticeInteractionCell from "./NoticeInteractionCell.vue";

import _get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import merge from "lodash/merge";
import cloneDeep from "lodash/cloneDeep";
import concat from "lodash/concat";

@Component({
  components: {
    AiPopup,
    AiListStored,
    AiSubmitActions,
    AiContentMediaEditor,
    NoticeInteractionCell,
  },
})
export default class Home extends Mixins(SyncMixin) {
  @Prop({ type: Object, default: null }) recipient: any;
  @Prop({ type: Object, default: null }) query: any;
  @Prop({ type: Array, default: null }) albums: any;

  refresh: boolean = false;

  targetInteraction: any = null;
  description: string = "";
  medias: any = [];

  openActions: boolean = false;
  openReply: boolean = false;

  get innerAlbums() {
    if (this.recipient.target_class === "OAuth") {
      return this.albums;
    }
    return concat(
      this.albums,
      merge(this.recipient.target, { _resource: this.recipient.target_class })
    );
  }

  get openid() {
    return this.$auth.user.openid;
  }

  get isManager() {
    return (
      this.$auth.user.is_manager &&
      this.$auth.user.is_teacher &&
      this.$auth.user.curr_merch_id === _get(this.recipient, "merchant_id")
    );
  }

  get actions() {
    return [
      {
        label: "回复",
        disabled: _get(this.targetInteraction, "openid") !== this.openid,
        onClick: () => {
          this.actionReply();
        },
      },
      {
        label: "删除",
        disabled: _get(this.targetInteraction, "openid") === this.openid,
        onClick: () => {
          this.actionDelete();
        },
      },
      {
        label: "取消",
        onClick: () => {
          this.openActions = false;
        },
      },
    ];
  }

  get innerQuery() {
    return merge(
      {
        recipient_id: _get(this.recipient, "id"),
        extras: JSON.stringify({
          NoticeInteraction: ["user", "target", "attachments", "recipient"],
          OAuth: ["avatar"],
          MediaAttachment: ["media"],
          Media: ["file", "url"],
        }),
        sort: "id asc",
      },
      this.query || {}
    );
  }

  created() {
    this.$bus.$on("show:popup:reply", (recipient) => {
      if (_get(this.recipient, "id") === _get(recipient, "id")) {
        this.openReply = true;
      }
    });
  }

  updateList() {
    this.$nextTick(() => {
      this.$bus.$emit("infinite:scroll:refresh");
    });
  }

  showActions(interaction) {
    this.targetInteraction = interaction;
    this.openActions = true;
  }

  actionReply() {
    this.openReply = true;
    this.openActions = false;
  }

  actionDelete() {
    this.openActions = false;
    this.$hui.confirm.show({
      title: "删除确认",
      message: `是否确认删除本条回复? 本操作不可恢复，请谨慎操作!`,
      confirmText: "确认",
      cancelText: "取消",
      onConfirm: () => {
        this.deleteEntity({
          store: "noticeInteraction",
          id: this.targetInteraction.id,
          success: () => {
            this.refresh = true;
            this.targetInteraction = null;
            this.$hui.toast.info("删除成功");
          },
          failure: (err) => {
            this.targetInteraction = null;
            this.$hui.toast.error(err.response.data.message);
          },
        });
      },
      onCancel: () => {
        this.targetInteraction = null;
      },
    });
  }

  onCancel() {
    this.targetInteraction = null;
    this.openReply = false;
  }

  onSubmit() {
    if (isEmpty(this.description) && isEmpty(this.medias)) {
      this.$hui.toast.error("回复内容不可为空");
      return;
    }

    const res: any = {
      description: this.description,
      medias: this.medias,
      recipient_id: this.recipient.id,
      notice_id: this.recipient.notice_id,
      merchant_id: this.recipient.merchant_id,
    };

    if (!isEmpty(this.targetInteraction)) {
      res.target_id = this.targetInteraction.id;
      res.target_class = "TargetInteraction";
    }

    this.saveEntity({
      store: "noticeInteraction",
      res: res,
      success: () => {
        this.refresh = true;
        this.$hui.toast.info("提交成功");
        this.targetInteraction = null;
        this.openReply = false;
      },
    });
  }
}
</script>
<style lang="scss" scoped>
.notice-interactions {
  & ::v-deep .ai-list-stored__list {
    background: #f7f6f6;
    padding: 18px 10px;
    display: flex;
    flex-direction: column;
  }
}
.actions {
  text-align: center;
  font-size: 14px;
  line-height: 3;
  font-weigth: 600;
}
.editor {
  & ::v-deep .h-popup_position-bottom {
    padding: 20px;
    border-radius: 20px 20px 0px 0px;
  }
  &-content {
  }
}
</style>
