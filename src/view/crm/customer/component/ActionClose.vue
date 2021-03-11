<template>
  <div class="wrapper">
    <ai-button v-if="showBtn" @click.native="show = true"> 关闭 </ai-button>
    <ai-dialog v-model="show">
      <div class="dialog">
        <div class="title">关闭线索</div>
        <ai-selection :options="tags" v-model="tag" />
        <ai-input-textarea
          v-model="reason"
          class="remark"
          placeholder="更多信息补充(可选)"
        />
        <ai-submit-actions @cancel="show = false" @submit="submit" />
      </div>
    </ai-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Mixins } from "vue-property-decorator";

import SyncMixin from "@/mixin/SyncMixin";

import AiButton from "@/view/component/AiButton.vue";
import AiDialog from "@/view/component/AiDialog.vue";
import AiInputTextarea from "@/view/component/AiInputTextarea.vue";
import AiSubmitActions from "@/view/component/AiSubmitActions.vue";
import AiSelection from "@/view/component/AiSelection.vue";

import isEmpty from "lodash/isEmpty";
import _get from "lodash/get";
import uniq from "lodash/uniq";
import concat from "lodash/concat";

@Component({
  components: {
    AiButton,
    AiDialog,
    AiInputTextarea,
    AiSubmitActions,
    AiSelection,
  },
})
export default class Home extends Mixins(SyncMixin) {
  @Prop({ type: Object, default: null }) customer: any;

  show: boolean = false;

  reason: string = "";
  tag: string = "";
  tags: any = ["无效线索", "已签单", "转售后", "其他原因"];

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
    if (isEmpty(this.reason) && isEmpty(this.tag)) {
      this.$hui.toast.info("关闭原因不可为空");
      return;
    }

    let tags = isEmpty(this.customer.tags) ? [] : this.customer.tags.split(",");
    tags = isEmpty(this.tag) ? tags : concat(tags, [this.tag]);

    this.id = this.customer.id;
    this.saveEntity({
      res: {
        id: this.id,
        op: "close",
        status: "finished",
        tags: uniq(tags).join(","),
        reason: this.tag + "," + this.reason,
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

  .remark {
    height: 100px;
  }
}
</style>
