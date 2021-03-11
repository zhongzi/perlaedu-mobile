<template>
  <div class="wrapper transfer">
    <ai-button
      @click.native.stop="onClick"
      :type="(isTransferToSelf && 'primary') || 'info'"
    >
      {{ isTransferToSelf ? "一键领取" : "转移" }}
    </ai-button>
    <ai-dialog v-model="open">
      <div class="dialog">
        <div class="title">转移跟进关系</div>
        <ai-selection-stored
          class="agents"
          v-if="open"
          v-model="followerOpenid"
          resource="oauth"
          labelKey="nickname"
          valueKey="openid"
          unsetOptionLabel="退回公海"
          :query="query"
          :enableUnsetOption="true"
          @selected="(v) => (follower = v)"
        />
        <ai-input-textarea
          v-model="reason"
          class="remark"
          placeholder="更多信息补充(可选)"
        />
        <ai-submit-actions
          @cancel="open = false"
          @submit="transfer"
          class="actions"
        />
      </div>
    </ai-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Mixins } from "vue-property-decorator";

import SyncMixin from "@/mixin/SyncMixin";

import AiButton from "@/view/component/AiButton.vue";
import AiDialog from "@/view/component/AiDialog.vue";
import AiSelectionStored from "@/view/component/AiSelectionStored.vue";
import AiInputTextarea from "@/view/component/AiInputTextarea.vue";
import AiSubmitActions from "@/view/component/AiSubmitActions.vue";

import isEmpty from "lodash/isEmpty";

@Component({
  components: {
    AiButton,
    AiDialog,
    AiSelectionStored,
    AiSubmitActions,
    AiInputTextarea,
  },
})
export default class Home extends Mixins(SyncMixin) {
  @Prop({ type: Object, default: null }) customer: any;
  @Prop({ type: Boolean, default: false }) isTransferToSelf: boolean;

  follower: any = null;
  followerOpenid: string = null;
  open: boolean = false;
  reason: string = "";

  get query() {
    return {
      kind: ["agent", "admin"],
    };
  }

  created() {
    this.store = "crmCustomer";
  }

  onClick() {
    if (!this.isTransferToSelf) {
      this.open = true;
      return;
    }

    this.follower = this.$auth.user;
    this.followerOpenid = this.follower.openid;
    this.transfer();
  }

  transfer() {
    const message = this.follower.id
      ? `确定变更跟进关系到 [${this.follower.nickname}] 名下吗?`
      : "您正在返还当前客户到公海？";

    this.open = false;
    this.$hui.confirm.show({
      title: "跟进关系变更确认",
      message: message,
      confirmText: "确认",
      cancelText: "取消",
      onConfirm: () => {
        this.submit();
      },
      onCancel: () => {
        this.open = true;
      },
    });
  }

  submit() {
    const isSelf = this.followerOpenid === this.$auth.user.openid;
    this.id = this.customer.id;
    this.saveEntity({
      res: {
        op: "transfer",
        id: this.id,
        follower_openid: this.followerOpenid,
        reason: this.reason,
      },
      success: () => {
        this.$nextTick(() => {
          this.open = false;
          this.$emit("refresh");
        });
      },
    });
  }
}
</script>
<style lang="scss" scoped>
.dialog {
  padding: 30px 20px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .title {
    font-size: 18px;
    font-weight: 600;
  }
  .actions {
    width: 100%;
  }
}
</style>
