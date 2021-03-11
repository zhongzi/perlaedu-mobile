<template>
  <ai-card class="wrapper action">
    <template v-slot:header>
      <ai-cell class="header">
        <template v-slot:cover v-if="action.user">
          <img :src="action | safe('user.avatar')" class="cover" />
        </template>
        <template v-slot:title>
          <span class="title">
            {{ action | safe("user.nickname", "来源线索") }}
          </span>
        </template>
        <template v-slot:subtitle>
          <span class="subtitle"
            >跟进时间: {{ action.created_at | date("MM-dd HH:mm") }}</span
          >
        </template>
        <template v-slot:right v-if="status">
          <ai-badge :content="badgeContent" :color="status.color" />
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

import _get from "lodash/get";

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

  get job() {
    return _get(this.action, "job");
  }

  get badgeContent() {
    let content = `${this.status.text}`;
    if (this.status === CrmCustomerStatus.following && this.job) {
      content += ` / ${_get(this.job, "title", "")}`;
    }
    return content;
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
      width: 24px;
      border-radius: 50%;
      margin-right: 5px;
    }
    & ::v-deep .ai-cell__left-info-header-title {
      font-size: 13px;
      line-height: 1;
    }
    & ::v-deep .ai-cell__left-info-header-subtitle {
      font-size: 11px;
      line-height: 1;
    }
  }
  .content {
    margin-bottom: 0px;
  }
}
</style>
