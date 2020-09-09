<template>
  <div class="wrapper transfer">
    <hui-button type="primary" @click.native="open = true">
      转移跟进关系
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
          @selected="(v) => (follower = v)"
        />
        <hui-button type="primary" @click.native="transfer" class="action"
          >确定</hui-button
        >
      </div>
    </ai-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Mixins } from "vue-property-decorator";

import SyncMixin from "@/mixin/SyncMixin";
import AiDialog from "@/view/component/AiDialog.vue";
import AiSelectionStored from "@/view/component/AiSelectionStored.vue";

import isEmpty from "lodash/isEmpty";

@Component({
  components: {
    AiDialog,
    AiSelectionStored,
  },
})
export default class Home extends Mixins(SyncMixin) {
  @Prop({ type: Object, default: null }) clue: any;

  follower: any = null;
  followeOpenid: string = null;
  open: boolean = false;

  get query() {
    return {
      kind: "agent",
    };
  }

  created() {
    this.store = "crmClue";
  }

  transfer() {
    this.$hui.confirm.show({
      title: "跟进关系变更确认",
      message: `确定变更跟进关系到 [${this.follower.nickname}] 名下吗?`,
      confirmText: "确认",
      cancelText: "取消",
      onConfirm: () => {
        this.submit();
      },
    });
  }

  submit() {
    if (isEmpty(this.followeOpenid)) return;

    this.id = this.clue.id;
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
