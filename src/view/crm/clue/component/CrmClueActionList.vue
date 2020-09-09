<template>
  <div class="wrapper actions">
    <ai-list-stored
      class="list"
      resource="crmClueAction"
      scrollHeight="60vh"
      :query="query"
      :refresh.sync="refresh"
    >
      <template v-slot:item="{ item, tag }">
        <crm-clue-action :action="item" :outerTag="tag" class="item" />
      </template>
    </ai-list-stored>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

import AiListStored from "@/view/component/AiListStored.vue";

import CrmClueAction from "./CrmClueAction.vue";

import merge from "lodash/merge";
import isEmpty from "lodash/isEmpty";

@Component({
  components: {
    AiListStored,
    CrmClueAction,
  },
})
export default class Home extends Vue {
  @Prop({ type: Object, default: null }) clue: any;

  refresh: boolean = true;

  created() {
    this.$bus.$on("inner:action:list:refresh", () => {
      this.refresh = true;
    });
  }
  get query() {
    return {
      clue_id: this.clue.id,
      extras: JSON.stringify({
        CrmClueAction: ["user"],
        OAuth: ["avatar"],
      }),
    };
  }
}
</script>
<style lang="scss" scoped>
.actions {
  padding: 20px 10px;

  .list {
    width: 100%;
  }
  .item {
    margin: 10px 0px;
  }
}
</style>
