<template>
  <div class="wrapper customer-detail">
    <crm-customer :customer="customer" class="header" />
    <ai-tab-rounded v-model="curTabIdx" :tabs="tabs" />
    <template v-if="curTabIdx === 0">
      <crm-customer :customer="customer" :isInDetail="true" @refresh="load" />
    </template>
    <template v-else-if="curTabIdx === 1">
      <crm-clue-list :customer="customer" />
    </template>
    <template v-else>
      <crm-customer-action-list :customer="customer" />
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Mixins } from "vue-property-decorator";

import SyncMixin from "@/mixin/SyncMixin";

import AiTabRounded from "@/view/component/AiTabRounded.vue";
import AiFixedFooter from "@/view/component/AiFixedFooter.vue";

import CrmCustomer from "./component/CrmCustomer.vue";
import CrmClueList from "./component/CrmClueList.vue";
import CrmCustomerActionList from "./component/CrmCustomerActionList.vue";

@Component({
  components: {
    AiTabRounded,
    AiFixedFooter,
    CrmCustomer,
    CrmClueList,
    CrmCustomerActionList,
  },
})
export default class Home extends Mixins(SyncMixin) {
  tabs: any = [
    { label: "客户详情", value: "detail" },
    { label: "过往线索", value: "customer" },
    { label: "跟踪记录", value: "action" },
  ];
  curTabIdx: number = 0;

  get customer() {
    return this.entity;
  }

  created() {
    this.store = "crmCustomer";
    this.id = this.$route.params.customerId;
    this.load();
  }

  load() {
    this.loadEntity({
      query: {
        extras: JSON.stringify({
          OAuth: ["avatar", "persons", "merchants"],
          Person: ["merchant"],
          Merchant: ["agent"],
          CrmCustomer: [
            "user",
            "persons",
            "merchants",
            "referrer",
            "follower",
            "u_person",
            "r_person",
            "f_person",
            "latest_action",
            "channel",
            "source",
            "target",
          ],
        }),
      },
    });
  }
}
</script>
<style lang="scss" scoped>
.customer-detail {
  padding: 10px;
  .header {
    margin-bottom: 10px;
  }
}
</style>
