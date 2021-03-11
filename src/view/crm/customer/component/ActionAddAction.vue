<template>
  <div class="wrapper add-action">
    <ai-button type="primary" @click.native.stop="open"> 跟进 </ai-button>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Mixins, Watch } from "vue-property-decorator";

import SyncMixin from "@/mixin/SyncMixin";

import AiButton from "@/view/component/AiButton.vue";
import AiDialog from "@/view/component/AiDialog.vue";
import AiRichTextQuillEditor from "@/view/component/AiRichTextQuillEditor.vue";

import isEmpty from "lodash/isEmpty";
import _get from "lodash/get";

@Component({
  components: {
    AiButton,
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
