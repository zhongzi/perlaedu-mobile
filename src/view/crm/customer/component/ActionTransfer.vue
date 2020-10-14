<template>
  <div class="wrapper transfer">
    <hui-button type="primary" @click.native="open = true">
      转移关系
    </hui-button>
    <ai-dialog v-model="open">
      <div class="dialog">
        <div class="title">转移跟进关系</div>
        <ai-selection-stored
          class="agents"
          v-if="open"
          v-model="followeOpenid"
          mode="border"
          resource="oauth"
          labelKey="nickname"
          valueKey="openid"
          :query="query"
          :enableUnsetOption="true"
          @selected="(v) => (follower = v)"
        />
        <ai-submit-actions @cancel="open = false" @submit="transfer" />
      </div>
    </ai-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Mixins } from "vue-property-decorator";

import SyncMixin from "@/mixin/SyncMixin";

import AiDialog from "@/view/component/AiDialog.vue";
import AiSelectionStored from "@/view/component/AiSelectionStored.vue";
import AiSubmitActions from "@/view/component/AiSubmitActions.vue";

import isEmpty from "lodash/isEmpty";

@Component({
  components: {
    AiDialog,
    AiSelectionStored,
    AiSubmitActions,
  },
})
export default class Home extends Mixins(SyncMixin) {
  @Prop({ type: Object, default: null }) customer: any;

  follower: any = null;
  followeOpenid: string = null;
  open: boolean = false;

  get query() {
    return {
      kind: ["agent", "admin"],
    };
  }

  created() {
    this.store = "crmCustomer";
  }

  transfer() {
    const message = this.follower.id
      ? `确定变更跟进关系到 [${this.follower.nickname}] 名下吗?`
      : "您正在清空当前客户跟进关系？";

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
    if (!this.follower && !this.follower.id) return;

    this.id = this.customer.id;
    this.saveEntity({
      res: {
        id: this.id,
        follower_openid: this.followeOpenid,
        followed_at: new Date(),
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
  padding: 50px 10px 10px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .title {
    font-size: 18px;
    font-weight: 600;
  }
  .agents {
    margin: 20px;
    width: 80%;
  }
  .action {
    width: 50%;
    font-size: 18px;
  }
}
</style>
