<template>
  <div class="wrapper customers">
    <ai-tab-rounded v-model="curTabIdx" :tabs="tabs" />
    <template v-for="tab in tabs">
      <keep-alive :key="tab.value">
        <ai-list-stored
          v-if="curTab === tab"
          resource="crmCustomer"
          :query="query"
          scrollHeight="90vh"
        >
          <template v-slot:item="{ item, tag }">
            <crm-customer
              :customer="item"
              :outerTag="tag"
              :isInDetail="false"
            />
          </template>
        </ai-list-stored>
      </keep-alive>
    </template>
    <ai-float-action @click="add" icon="plus" class="add" />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Mixins } from "vue-property-decorator";

import AiTabRounded from "@/view/component/AiTabRounded.vue";
import AiSelectionStored from "@/view/component/AiSelectionStored.vue";
import AiSelectionEnum from "@/view/component/AiSelectionEnum.vue";
import AiListStored from "@/view/component/AiListStored.vue";
import AiFloatAction from "@/view/component/AiFloatAction.vue";

import { CrmCustomerStatus } from "@/enum/crm_customer_status";

import CrmCustomer from "./component/CrmCustomer.vue";

import merge from "lodash/merge";
import isEmpty from "lodash/isEmpty";
import filter from "lodash/filter";
import _get from "lodash/get";

@Component({
  components: {
    AiTabRounded,
    AiListStored,
    AiSelectionStored,
    AiSelectionEnum,
    AiFloatAction,
    CrmCustomer,
  },
})
export default class Home extends Vue {
  curTabIdx: number = 0;

  get isAdmin() {
    return _get(this.$auth, "user.kind") === 1;
  }

  get isAgent() {
    return _get(this.$auth, "user.kind") === 2;
  }

  get enabledRestoringList() {
    return this.isAdmin || _get(this.$auth, "user.agent.level") === 1;
  }

  get enabledPendingList() {
    return this.isAdmin;
  }

  get tabs() {
    return filter(
      [
        {
          label: "新客户",
          value: "pending",
          disabled: !this.enabledPendingList,
        },
        { label: "待确认", value: "confirming" },
        { label: "跟进中", value: "following" },
        {
          label: "公海",
          value: "restoring",
          disabled: !this.enabledRestoringList,
        },
        { label: "已结束", value: "finished" },
      ],
      (o) => o.disabled !== true
    );
  }

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
          "follower_json",
          "u_person",
          "r_person",
          "f_person",
          "channel",
          "source",
          "target",
          "job",
          "job_stage",
        ],
      }),
    };
  }

  created() {
    this.reset();
  }

  activated() {
    this.reset();
  }

  reset() {
    this.curTabIdx = parseInt(this.$route.query.tab as any) || 0;
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
  padding: 10px;
  .add {
    background: #fd6700;
    color: #fff;
    border-radius: 50%;
    width: 60px;
    height: 60px;
  }
}
</style>
