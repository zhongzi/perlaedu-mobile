<template>
  <div class="wrapper add-action">
    <hui-button type="info" @click.native="open = true">
      新跟进记录
    </hui-button>
    <ai-dialog v-model="open">
      <div class="dialog">
        <div class="title">添加跟进记录</div>
        <ai-rich-text-quill-editor v-model="remark" />
        <hui-button type="info" @click.native="add" class="action"
          >提交</hui-button
        >
      </div>
    </ai-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Mixins, Watch } from "vue-property-decorator";

import SyncMixin from "@/mixin/SyncMixin";

import AiDialog from "@/view/component/AiDialog.vue";
import AiRichTextQuillEditor from "@/view/component/AiRichTextQuillEditor.vue";

import isEmpty from "lodash/isEmpty";
import _get from "lodash/get";

@Component({
  components: {
    AiDialog,
    AiRichTextQuillEditor,
  },
})
export default class Home extends Mixins(SyncMixin) {
  @Prop({ type: Object, default: null }) clue: any;

  action: any = null;
  remark: string = null;
  open: boolean = false;

  created() {
    this.store = "crmClueAction";

    this.$bus.$on("inner:action:edit", (action) => {
      this.action = action;
      this.remark = action.remark;
      this.open = true;
    });
  }

  add() {
    this.open = false;
    this.$hui.confirm.show({
      title: "添加跟进记录确认",
      message: `确认添加吗？`,
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
    if (isEmpty(this.remark)) return;

    this.id = _get(this.action, "id");
    this.saveEntity({
      res: {
        id: this.id,
        clue_id: _get(this.action, "clue_id", this.clue.id),
        remark: this.remark,
      },
      success: () => {
        this.$nextTick(() => {
          this.action = null;
          this.remark = null;
          this.open = false;
          this.$bus.$emit("inner:action:list:refresh");
        });
      },
    });
  }
}
</script>
<style lang="scss" scoped>
.dialog {
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

  .action {
    width: 80%;
    margin: 20px;
  }
}
</style>
