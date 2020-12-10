<template>
  <ai-dialog :value="value" @input="updateValue" class="wrapper remark">
    <ai-input-textarea v-model="remark" placeholder="备注说明" />
    <ai-submit-actions @cancel="updateValue(false)" @submit="onSubmit" />
  </ai-dialog>
</template>

<script lang="ts">
import { Component, Vue, Prop, Mixins } from "vue-property-decorator";

import SyncMixin from "@/mixin/SyncMixin";

import AiDialog from "@/view/component/AiDialog.vue";
import AiInputTextarea from "@/view/component/AiInputTextarea.vue";
import AiSubmitActions from "@/view/component/AiSubmitActions.vue";

import _get from "lodash/get";

@Component({
  components: {
    AiDialog,
    AiInputTextarea,
    AiSubmitActions,
  },
})
export default class Home extends Mixins(SyncMixin) {
  @Prop({ type: Boolean, default: false }) value: boolean;
  @Prop({ type: Object, default: null }) merchant: any;

  remark: string = null;

  created() {
    this.store = "mongoMerchant";
  }

  updateValue(v) {
    this.$emit("input", v);
  }

  onSubmit() {
    this.saveEntity({
      store: "crmClue",
      res: {
        code: this.$configs.crmChannelCodeDT,
        name: this.merchant.title,
        phone: this.merchant.tel,
        remark: this.remark,
        referrer_openid: _get(
          this.merchant,
          "follower.openid",
          this.$auth.user.openid
        ),
      },
      success: (resp) => {
        this.$nextTick(() => {
          this.relatedClue(resp.data);
        });
      },
    });
  }

  relatedClue(clue) {
    this.id = this.merchant._id;
    this.saveEntity({
      res: {
        id: this.id,
        update: {
          related_clue_id: clue.target_id,
        },
      },
      success: (resp) => {
        this.$nextTick(() => {
          this.commitChanges(this.id, {
            related_clue_id: clue.target_id,
          });
          this.updateValue(false);
        });
      },
    });
  }
}
</script>
<style lang="scss" scoped></style>
