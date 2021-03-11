<template>
  <div class="wrapper editing-share">
    <ai-cell>
      <template v-slot:title> 自定义分享描述 </template>
      <template v-slot:subtitle> 建议长度保持在50个汉字以内 </template>
      <template v-slot:right>
        <ai-button @click.native="open = true">设置</ai-button>
      </template>
    </ai-cell>
    <ai-dialog v-model="open">
      <div class="dialog">
        <div class="title">自定义分享描述</div>
        <div class="subtitle">建议长度保持在50个汉字以内</div>
        <ai-input-textarea v-model="desc" class="desc" />
        <ai-submit-actions @cancel="open = false" @submit="save" />
      </div>
    </ai-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Mixins, Watch } from "vue-property-decorator";

import SyncMixin from "@/mixin/SyncMixin";

import AiDialog from "@/view/component/AiDialog.vue";
import AiCell from "@/view/component/AiCell.vue";
import AiButton from "@/view/component/AiButton.vue";
import AiInputTextarea from "@/view/component/AiInputTextarea.vue";
import AiSubmitActions from "@/view/component/AiSubmitActions.vue";

import _get from "lodash/get";
import merge from "lodash/merge";
import cloneDeep from "lodash/cloneDeep";

@Component({
  components: {
    AiDialog,
    AiCell,
    AiButton,
    AiInputTextarea,
    AiSubmitActions,
  },
})
export default class Home extends Mixins(SyncMixin) {
  @Prop({ type: Object, default: null }) merchant: any;

  open: boolean = false;
  desc: String = null;

  get website() {
    return _get(this.merchant, "website", {});
  }

  get share() {
    return _get(this.website, "share", {});
  }

  created() {
    this.store = "website";
    this.resetDesc();
  }

  @Watch("website", { deep: true })
  onWebsiteChanged() {
    this.resetDesc();
  }

  resetDesc() {
    this.desc = this.share.desc;
  }

  save() {
    if (!this.website.id) return;

    this.id = this.website.id;
    this.saveEntity({
      res: {
        id: this.id,
        share: merge({}, this.share, { desc: this.desc }),
      },
      success: () => {
        this.$hui.toast.info("保存成功");
        this.open = false;
      },
    });
  }
}
</script>
<style lang="scss" scoped>
.editing-share {
  margin: 10px 20px;
}
.dialog {
  padding: 20px;

  .title {
    font-size: 18px;
    font-weight: 600;
    line-height: 2;
    text-align: center;
  }
  .subtitle {
    font-size: 13px;
    color: #9b9b9b;
  }

  .desc ::v-deep textarea {
    font-size: 13px;
    line-height: 1;
    color: #9b9b9b;
  }
}
</style>
