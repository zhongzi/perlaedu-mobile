<template>
  <div class="wrapper actions">
    <action-add-action :customer="customer" class="add" />
    <ai-list-stored
      class="list"
      resource="crmCustomerAction"
      scrollHeight="70vh"
      :query="query"
      :refresh.sync="refresh"
    >
      <template v-slot:item="{ item, tag }">
        <crm-customer-action :action="item" :outerTag="tag" class="item" />
      </template>
    </ai-list-stored>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

import AiListStored from "@/view/component/AiListStored.vue";

import CrmCustomerAction from "./CrmCustomerAction.vue";
import ActionAddAction from "./ActionAddAction.vue";

import merge from "lodash/merge";
import isEmpty from "lodash/isEmpty";

@Component({
  components: {
    AiListStored,
    CrmCustomerAction,
    ActionAddAction,
  },
})
export default class Home extends Vue {
  @Prop({ type: Object, default: null }) customer: any;

  refresh: boolean = true;

  created() {
    this.$bus.$on("inner:action:list:refresh", () => {
      this.refresh = true;
    });
  }
  get query() {
    return {
      customer_id: this.customer.id,
      extras: JSON.stringify({
        CrmCustomerAction: ["user"],
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
  .add {
    & ::v-deep button {
      width: 100%;
    }
  }
}
</style>
