<template>
  <div class="wrapper">
    <hui-button v-if="showBtn" @click.native="show = true" class="close">
      关闭线索
    </hui-button>
    <ai-dialog v-model="show">
      <div class="dialog">
        <ai-input-textarea
          v-model="reason"
          class="remark"
          placeholder="请输入关闭原因"
        />
        <ai-submit-actions @cancel="show = false" @submit="submit" />
      </div>
    </ai-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Mixins } from "vue-property-decorator";

import SyncMixin from "@/mixin/SyncMixin";

import AiDialog from "@/view/component/AiDialog.vue";
import AiInputTextarea from "@/view/component/AiInputTextarea.vue";
import AiSubmitActions from "@/view/component/AiSubmitActions.vue";

import isEmpty from "lodash/isEmpty";
import _get from "lodash/get";

@Component({
  components: {
    AiDialog,
    AiInputTextarea,
    AiSubmitActions,
  },
})
export default class Home extends Mixins(SyncMixin) {
  @Prop({ type: Object, default: null }) customer: any;

  show: boolean = false;
  reason: string = "";

  get showBtn() {
    return _get(this.customer, "status") !== "finished";
  }

  created() {
    this.store = "crmCustomer";
  }

  close() {
    this.$hui.confirm.show({
      title: "关闭确认",
      message: `确定关闭当前线索`,
      confirmText: "确认",
      cancelText: "取消",
      onConfirm: () => {
        this.submit();
      },
    });
  }

  submit() {
    if (isEmpty(this.reason)) {
      this.$hui.toast.info("关闭原因不可为空");
      return;
    }

    this.id = this.customer.id;
    this.saveEntity({
      res: {
        id: this.id,
        status: "finished",
        reason: this.reason,
      },
      success: () => {
        this.$nextTick(() => {
          this.show = false;
        });
      },
    });
  }
}
</script>
<style lang="scss" scoped>
.close {
  display: block;
  width: 80%;
  border: none;
  margin: 20px auto;
}
.dialog {
  .remark {
    height: 200px;
  }
}
</style>
