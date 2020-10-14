<template>
  <div class="wrapper action-editing">
    <div class="title">跟进记录</div>
    <ai-rich-text-sections-editor
      v-model="remark"
      class="content"
      :jsonable="false"
      imageType="crm"
    />
    <ai-dialog v-model="showDialog">
      <div class="dialog">
        <h3>选择对应跟进任务</h3>
        <ai-selection-stored
          resource="crmJob"
          v-model="jobId"
          :query="jobQuery"
          class="selection"
        />
        <ai-submit-actions @cancel="showDialog = false" @submit="add" />
      </div>
    </ai-dialog>
    <ai-fixed-footer>
      <ai-submit-actions @cancel="$router.go(-1)" @submit="setJobId" />
    </ai-fixed-footer>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Mixins, Watch } from "vue-property-decorator";

import SyncMixin from "@/mixin/SyncMixin";

import AiDialog from "@/view/component/AiDialog.vue";
import AiFixedFooter from "@/view/component/AiFixedFooter.vue";
import AiRichTextSectionsEditor from "@/view/component/AiRichTextSectionsEditor.vue";
import AiSelectionStored from "@/view/component/AiSelectionStored.vue";
import AiSubmitActions from "@/view/component/AiSubmitActions.vue";

import isEmpty from "lodash/isEmpty";
import _get from "lodash/get";

@Component({
  components: {
    AiDialog,
    AiSelectionStored,
    AiFixedFooter,
    AiRichTextSectionsEditor,
    AiSubmitActions,
  },
})
export default class Home extends Mixins(SyncMixin) {
  showDialog: boolean = false;
  customer: any = null;
  customerId: any = null;
  remark: string = null;
  jobId: string | number = null;

  get isNew() {
    return this.id === "new";
  }

  get action() {
    return this.entity;
  }

  get jobQuery() {
    return {
      sort: "id asc",
    };
  }

  created() {
    this.store = "crmCustomerAction";
    this.id = this.$route.params.actionId;
    this.id = this.id !== "new" ? this.id : null;
    this.customerId = this.$route.params.customerId;
    this.id && this.loadEntity();

    this.loadEntityExtra({
      store: "crmCustomer",
      id: this.customerId,
      success: (resp) => {
        this.customer = resp.data;
      },
    });
  }

  @Watch("action", { deep: true })
  onActionChanged() {
    this.remark = this.action.remark;
    this.jobId = this.action.job_id;
  }

  @Watch("customer", { deep: true })
  onCustomerChanged() {
    if (!this.id && !isEmpty(this.customer)) {
      this.jobId = this.customer.job_id;
    }
  }

  setJobId() {
    this.showDialog = true;
  }

  add() {
    this.showDialog = false;
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
        job_id: this.jobId,
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

.dialog {
  padding: 30px 20px;
  text-align: center;

  .selection {
    margin: 30px auto;
  }

  .action {
    width: 70%;
  }
}
</style>
