<template>
  <div class="wrapper notices">
    <ly-search v-model="keyword" placeholder="查询关键词" class="search" />
    <notice-templates v-model="template" :enabledAll="true" class="section" />
    <status v-model="status" class="section" />
    <ai-list-stored
      resource="notice"
      scrollHeight="50vh"
      :query="query"
      :refresh.sync="refresh"
    >
      <template v-slot:item="{ item }">
        <notice-cell :notice="item" @refresh="refresh = true" />
      </template>
    </ai-list-stored>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

import LySearch from "@/view/layout/component/Search.vue";
import AiListStored from "@/view/component/AiListStored.vue";

import Status from "./Status.vue";
import NoticeCell from "./NoticeCell.vue";
import NoticeTemplates from "./NoticeTemplates.vue";

import isEmpty from "lodash/isEmpty";

@Component({
  components: {
    LySearch,
    AiListStored,
    Status,
    NoticeTemplates,
    NoticeCell,
  },
})
export default class Home extends Vue {
  @Prop({ type: Object, default: null }) merchant: any;

  keyword: string = "";
  template: any = null;
  status: string = null;
  refresh: boolean = false;

  get query() {
    const query: any = {
      merchant_id: this.merchant.id,
      sort: "updated_at desc",
      extras: JSON.stringify({
        Notice: ["user", "template", "user"],
        User: ["avatar"],
      }),
    };
    if (this.template) {
      query.template_id = this.template.id;
    }
    if (!isEmpty(this.status)) {
      query.status = this.status;
    }
    if (!isEmpty(this.keyword)) {
      query.filters = JSON.stringify({
        title: [this.keyword],
      });
    }
    return query;
  }
}
</script>
<style lang="scss" scoped>
.notices {
  margin: 10px;
  padding: 10px 0px 0px;

  .section {
    margin: 10px 0px;
  }
}
</style>
