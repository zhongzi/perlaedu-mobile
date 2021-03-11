<template>
  <div class="wrapper editing">
    <div class="title">客户基本信息</div>
    <ai-input class="field" label="名称" v-model="innerCustomer.name" />
    <ai-line />
    <ai-input class="field" label="电话" v-model="innerCustomer.phone" />
    <ai-line />
    <ai-input class="field" label="地址" v-model="innerCustomer.address" />
    <ai-line />
    <ai-input-textarea
      class="field remark"
      label="备注"
      v-model="innerCustomer.remark"
    />
    <ai-fixed-footer>
      <ai-submit-actions @cancel="$router.go(-1)" @submit="add" />
    </ai-fixed-footer>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Mixins, Watch } from "vue-property-decorator";

import SyncMixin from "@/mixin/SyncMixin";

import AiInput from "@/view/component/AiInput.vue";
import AiInputTextarea from "@/view/component/AiInputTextarea.vue";
import AiLine from "@/view/component/AiLine.vue";
import AiRichTextQuillEditor from "@/view/component/AiRichTextQuillEditor.vue";
import AiFixedFooter from "@/view/component/AiFixedFooter.vue";
import AiSubmitActions from "@/view/component/AiSubmitActions.vue";

import isEmpty from "lodash/isEmpty";
import _get from "lodash/get";
import cloneDeep from "lodash/cloneDeep";
import merge from "lodash/merge";

@Component({
  components: {
    AiInput,
    AiInputTextarea,
    AiLine,
    AiRichTextQuillEditor,
    AiFixedFooter,
    AiSubmitActions,
  },
})
export default class Home extends Mixins(SyncMixin) {
  innerCustomer: any = {};

  get customer() {
    return this.entity;
  }

  created() {
    this.store = "crmCustomer";
    this.id = this.$route.params.customerId;
    this.id = this.id !== "new" ? this.id : null;
    this.id && this.loadEntity();
  }

  @Watch("customer", { deep: true })
  onCustomerChanged() {
    this.innerCustomer = cloneDeep(this.customer);
  }

  add() {
    this.$hui.confirm.show({
      title: "提交客户信息",
      message: `确认提交吗？`,
      confirmText: "确认",
      cancelText: "取消",
      onConfirm: () => {
        this.submit();
      },
      onCancel: () => {},
    });
  }

  submit() {
    if (isEmpty(this.innerCustomer.phone)) {
      this.$hui.toast.error("手机号码不可为空");
      return;
    }

    this.saveEntity({
      res: merge({ op: "edit" }, this.innerCustomer),
      success: () => {
        this.$nextTick(() => {
          this.innerCustomer = {};
          this.$router.go(-1);
        });
      },
    });
  }
}
</script>
<style lang="scss" scoped>
.editing {
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #fff;
  margin: 20px;
  border-radius: 10px;

  .title {
    font-size: 18px;
    font-weight: 600;
    line-height: 2;
  }
  .field {
    width: 100%;
  }
  .action {
    width: 80%;
    margin: 20px;
  }
}
</style>
