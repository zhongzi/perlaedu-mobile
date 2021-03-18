<template>
  <div class="wrapper notices">
    <ai-list-stored
      resource="notice"
      scrollHeight="100vh"
      :query="innerQuery"
      :limit="5"
      :refresh.sync="refresh"
    >
      <template v-slot:item="{ item }">
        <notice-cell :notice="item" @refresh="refresh = true" class="notice" />
      </template>
    </ai-list-stored>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

import AiListStored from "@/view/component/AiListStored.vue";

import NoticeCell from "./NoticeCell.vue";

import isEmpty from "lodash/isEmpty";
import cloneDeep from "lodash/cloneDeep";

@Component({
  components: {
    AiListStored,
    NoticeCell,
  },
})
export default class Home extends Vue {
  @Prop({ type: Object, default: null }) merchant: any;
  @Prop({ type: Object, default: null }) query: any;

  refresh: boolean = false;

  get innerQuery() {
    const query: any = cloneDeep(this.query || {});
    if (!isEmpty(this.merchant)) {
      query.merchant_id = this.merchant.id;
    }
    query.extras = JSON.stringify({
      Notice: ["template", "user", "attachments", "merchant", "targets"],
      NoticeTarget: ["target"],
      Person: ["avatar_url"],
      MediaAttachment: ["media"],
      Media: ["url", "file"],
      OAuth: ["avatar"],
    });
    return query;
  }
}
</script>
<style lang="scss" scoped>
.notices {
  padding: 10px 20px;

  .notice {
    margin: 10px 0px;
    flex: 1;
  }

  & ::v-deep .ai-infinite-scroll__list {
    flex-direction: column;
  }
}
</style>
