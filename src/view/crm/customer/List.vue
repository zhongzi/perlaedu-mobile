<template>
  <div class="wrapper customers">
    <hui-button type="info" class="add" @click.native="add">
      新增客户线索
    </hui-button>
    <ai-tab-rounded v-model="curTabIdx" :tabs="tabs" />
    <ai-list-stored resource="crmCustomer" :query="query">
      <template v-slot:item="{ item, tag }">
        <crm-customer :customer="item" :outerTag="tag" :isInDetail="false" />
      </template>
    </ai-list-stored>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Mixins } from "vue-property-decorator";

import AiTabRounded from "@/view/component/AiTabRounded.vue";
import AiSelectionStored from "@/view/component/AiSelectionStored.vue";
import AiSelectionEnum from "@/view/component/AiSelectionEnum.vue";
import AiListStored from "@/view/component/AiListStored.vue";

import { CrmCustomerStatus } from "@/enum/crm_customer_status";

import CrmCustomer from "./component/CrmCustomer.vue";

import merge from "lodash/merge";
import isEmpty from "lodash/isEmpty";

@Component({
  components: {
    AiTabRounded,
    AiListStored,
    AiSelectionStored,
    AiSelectionEnum,
    CrmCustomer,
  },
})
export default class Home extends Vue {
  tabs: any = [
    { label: "新客户", value: "pending" },
    { label: "跟进中", value: "following" },
    { label: "公海", value: "restoring" },
    { label: "已结束", value: "finished" },
  ];
  curTabIdx: number = 0;

  get curTab() {
    return this.tabs[this.curTabIdx];
  }

  get query() {
    return {
      status: this.curTab.value,
      extras: JSON.stringify({
        OAuth: ["avatar"],
        CrmCustomer: [
          "user",
          "referrer",
          "follower",
          "u_person",
          "r_person",
          "f_person",
          "channel",
          "source",
          "target",
        ],
      }),
    };
  }

  add() {
    this.$router.push({
      name: "crmCustomerEditing",
      params: {
        customerId: "new",
      },
    });
  }
}
</script>
<style lang="scss" scoped>
.customers {
  padding: 20px 10px;
  .add {
    display: block;
    width: 100%;
    margin: 10px 0px;
  }
}
</style>
