<template>
  <div class="wrapper action-editing">
    <div class="title">跟进记录</div>
    <ai-rich-text-sections-editor
      v-model="remark"
      class="content"
      :jsonable="false"
      imageType="crm"
    />
    <ai-fixed-footer>
      <hui-button type="info" @click.native="add" class="action"
        >提交</hui-button
      >
    </ai-fixed-footer>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Mixins, Watch } from "vue-property-decorator";

import SyncMixin from "@/mixin/SyncMixin";

import AiDialog from "@/view/component/AiDialog.vue";
import AiFixedFooter from "@/view/component/AiFixedFooter.vue";
import AiRichTextSectionsEditor from "@/view/component/AiRichTextSectionsEditor.vue";

import isEmpty from "lodash/isEmpty";
import _get from "lodash/get";

@Component({
  components: {
    AiDialog,
    AiFixedFooter,
    AiRichTextSectionsEditor,
  },
})
export default class Home extends Mixins(SyncMixin) {
  customerId: any = null;
  remark: string = null;

  get isNew() {
    return this.id === "new";
  }

  get action() {
    return this.entity;
  }

  created() {
    this.store = "crmCustomerAction";
    this.id = this.$route.params.actionId;
    this.id = this.id !== "new" ? this.id : null;
    this.customerId = this.$route.params.customerId;
    this.id && this.loadEntity();
  }

  @Watch("action", { deep: true })
  onActionChanged() {
    this.remark = this.action.remark;
  }

  add() {
    this.$hui.confirm.show({
      title: "添加跟进记录确认",
      message: `确认添加吗？`,
      confirmText: "确认",
      cancelText: "取消",
      onConfirm: () => {
        this.submit();
      },
      onCancel: () => {},
    });
  }

  submit() {
    if (isEmpty(this.remark)) return;

    this.saveEntity({
      res: {
        id: this.id,
        customer_id: this.customerId,
        remark: this.remark,
      },
      success: () => {
        this.$nextTick(() => {
          this.remark = null;
          this.$router.go(-1);
        });
      },
    });
  }
}
</script>
<style lang="scss" scoped>
.action-editing {
  padding: 20px 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .title {
    font-size: 18px;
    font-weight: 600;
    line-height: 2;
  }
  .content {
    min-height: 80vh;
  }

  .action {
    width: 80%;
    margin: 20px;
  }
}
</style>
