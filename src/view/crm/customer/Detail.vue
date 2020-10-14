<template>
  <div class="wrapper customer-detail">
    <crm-customer :customer="customer" class="header" />
    <ai-tab-rounded v-model="curTabIdx" :tabs="tabs" />
    <template v-if="curTab.value === 'detail'">
      <crm-customer :customer="customer" :isInDetail="true" @refresh="load" />
    </template>
    <template v-else-if="curTab.value === 'action'">
      <crm-customer-action-list :customer="customer" />
    </template>
    <template v-else-if="curTab.value === 'clue'">
      <crm-clue-list :customer="customer" />
    </template>
    <template v-else-if="curTab.value === 'jobs'">
      <crm-job-list :customer="customer" />
    </template>
    <ai-float-action @click="gotoList" icon="home" class="float-button" />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Mixins } from "vue-property-decorator";

import SyncMixin from "@/mixin/SyncMixin";

import AiTabRounded from "@/view/component/AiTabRounded.vue";
import AiFixedFooter from "@/view/component/AiFixedFooter.vue";
import AiFloatAction from "@/view/component/AiFloatAction.vue";

import CrmCustomer from "./component/CrmCustomer.vue";
import CrmClueList from "./component/CrmClueList.vue";
import CrmCustomerActionList from "./component/CrmCustomerActionList.vue";
import CrmJobList from "./component/CrmJobList.vue";

@Component({
  components: {
    AiTabRounded,
    AiFixedFooter,
    AiFloatAction,
    CrmCustomer,
    CrmClueList,
    CrmCustomerActionList,
    CrmJobList,
  },
})
export default class Home extends Mixins(SyncMixin) {
  tabs: any = [
    { label: "客户详情", value: "detail" },
    { label: "工作清单", value: "jobs" },
    { label: "跟踪记录", value: "action" },
    { label: "过往事件", value: "customer" },
  ];
  curTabIdx: number = 0;

  get customer() {
    return this.entity;
  }

  get curTab() {
    return this.tabs[this.curTabIdx];
  }

  created() {
    this.curTabIdx = parseInt(this.$route.query.tab as any) || 0;

    this.store = "crmCustomer";
    this.id = this.$route.params.customerId;
    this.load();
  }

  gotoList() {
    this.$router.push({
      name: "crmCustomerList",
      query: {
        tab: "1",
      },
    });
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
            "job",
            "job_stage",
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

  .float-button {
    background: #fd6700;
    color: #fff;
    border-radius: 50%;
    width: 60px;
    height: 60px;
  }
}
</style>
