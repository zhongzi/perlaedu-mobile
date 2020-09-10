<template>
  <div class="wrapper clues">
    <ai-list-stored
      class="list"
      resource="crmClue"
      scrollHeight="60vh"
      :query="query"
    >
      <template v-slot:item="{ item, tag }">
        <crm-clue :clue="item" :outerTag="tag" class="item" />
      </template>
    </ai-list-stored>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

import AiListStored from "@/view/component/AiListStored.vue";

import CrmClue from "./CrmClue.vue";

import merge from "lodash/merge";
import isEmpty from "lodash/isEmpty";

@Component({
  components: {
    AiListStored,
    CrmClue,
  },
})
export default class Home extends Vue {
  @Prop({ type: Object, default: null }) customer: any;

  get query() {
    return {
      target_class: "CrmCustomer",
      target_id: this.customer.id,
      extras: JSON.stringify({
        CrmClue: ["user", "channel", "url"],
        OAuth: ["avatar"],
      }),
    };
  }
}
</script>
<style lang="scss" scoped>
.clues {
  padding: 20px 10px;

  .list {
    width: 100%;
  }
  .item {
    margin: 10px 0px;
  }
}
</style>
