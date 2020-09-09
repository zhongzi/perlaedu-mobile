<template>
  <div class="wrapper action">
    <ai-card>
      <template v-slot:header>
        <ai-cell class="header">
          <template v-slot:cover>
            <img :src="action | safe('user.avatar')" class="cover" />
          </template>
          <template v-slot:title>
            <span> {{ action | safe("user.nickname") }} </span>
          </template>
          <template v-slot:right>
            <ai-badge :content="status.text" :color="status.color" />
          </template>
        </ai-cell>
      </template>
      <template v-slot:body>
        <ai-rich-text-quill-editor :value="action.remark" :isEditing="false" />
      </template>
      <template v-slot:footer>
        <div class="footer">
          <div>更新时间: {{ action.created_at | date("MM-dd HH:mm") }}</div>
          <div class="actions">
            <hui-button @click.native="edit"> 编辑</hui-button>
            <hui-button @click.native="remove">删除</hui-button>
          </div>
        </div>
      </template>
    </ai-card>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Mixins } from "vue-property-decorator";

import SyncMixin from "@/mixin/SyncMixin";

import AiCell from "@/view/component/AiCell.vue";
import AiCard from "@/view/component/AiCard.vue";
import AiBadge from "@/view/component/AiBadge.vue";
import AiRichTextQuillEditor from "@/view/component/AiRichTextQuillEditor.vue";

import { CrmClueStatus } from "@/enum/crm_clue_status";

@Component({
  components: {
    AiCell,
    AiCard,
    AiBadge,
    AiRichTextQuillEditor,
  },
})
export default class Home extends Mixins(SyncMixin) {
  @Prop({ type: Object, default: null }) action: any;
  @Prop({ type: String, default: "" }) outerTag: string;

  get status() {
    return CrmClueStatus[this.action.action];
  }

  created() {
    this.store = "crmClueAction";
  }

  edit() {
    this.$bus.$emit("inner:action:edit", this.action);
  }

  remove() {
    this.id = this.action.id;
    this.tag = this.outerTag;
    this.deleteEntity({
      res: {
        id: this.id,
      },
    });
  }
}
</script>
<style lang="scss" scoped>
.action {
  width: 100%;
  .header {
    width: 100%;
    .cover {
      width: 40px;
      border-radius: 50%;
    }
  }
  .footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}
</style>
