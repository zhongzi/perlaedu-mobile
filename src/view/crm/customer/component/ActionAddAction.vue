<template>
  <div class="wrapper add-action">
    <hui-button type="info" @click.native.stop="open">
      新跟进记录
    </hui-button>
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
export default class Home extends Vue {
  @Prop({ type: Object, default: null }) customer: any;

  open() {
    this.$router.push({
      name: "crmCustomerActionEditing",
      params: {
        customerId: this.customer.id,
        actionId: "new",
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
