<template>
  <ai-card class="wrapper action">
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
      <ai-rich-text-sections-editor
        :value="action.remark"
        :isEditing="false"
        class="content"
      />
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
</template>

<script lang="ts">
import { Component, Vue, Prop, Mixins } from "vue-property-decorator";

import SyncMixin from "@/mixin/SyncMixin";

import AiCell from "@/view/component/AiCell.vue";
import AiCard from "@/view/component/AiCard.vue";
import AiBadge from "@/view/component/AiBadge.vue";
import AiRichTextSectionsEditor from "@/view/component/AiRichTextSectionsEditor.vue";

import { CrmCustomerStatus } from "@/enum/crm_customer_status";

@Component({
  components: {
    AiCell,
    AiCard,
    AiBadge,
    AiRichTextSectionsEditor,
  },
})
export default class Home extends Mixins(SyncMixin) {
  @Prop({ type: Object, default: null }) action: any;
  @Prop({ type: String, default: "" }) outerTag: string;

  get status() {
    return CrmCustomerStatus[this.action.action];
  }

  created() {
    this.store = "crmCustomerAction";
  }

  edit() {
    this.$router.push({
      name: "crmCustomerActionEditing",
      params: {
        customerId: this.action.customer_id,
        actionId: this.action.id,
      },
    });
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
  padding: 10px;
  .header {
    width: 100%;
    .cover {
      width: 40px;
      border-radius: 50%;
    }
  }
  .content {
    margin-bottom: 0px;
  }
  .footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}
</style>
