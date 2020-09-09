<template>
  <div class="wrapper clue-detail">
    <crm-clue :clue="clue" class="header" />
    <hui-tab-rounded v-model="curTabIdx" :tabs="tabs" label="label" />
    <template v-if="curTabIdx === 0">
      <crm-clue :clue="clue" :isInDetail="true" />
    </template>
    <template v-else>
      <crm-clue-action-list :clue="clue" />
    </template>
    <ai-fixed-footer>
      <div class="actions">
        <action-transfer :clue="clue" @refresh="load" />
        <action-add-action :clue="clue" />
        <action-close :clue="clue" @refresh="load" />
      </div>
    </ai-fixed-footer>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Mixins } from "vue-property-decorator";

import SyncMixin from "@/mixin/SyncMixin";

import AiFixedFooter from "@/view/component/AiFixedFooter.vue";

import ActionTransfer from "./component/ActionTransfer.vue";
import ActionAddAction from "./component/ActionAddAction.vue";
import ActionClose from "./component/ActionClose.vue";

import CrmClue from "./component/CrmClue.vue";
import CrmClueActionList from "./component/CrmClueActionList.vue";

@Component({
  components: {
    AiFixedFooter,
    CrmClue,
    CrmClueActionList,
    ActionTransfer,
    ActionAddAction,
    ActionClose,
  },
})
export default class Home extends Mixins(SyncMixin) {
  tabs: any = [
    { label: "线索详情", value: "pending" },
    { label: "跟踪明细", value: "following" },
  ];
  curTabIdx: number = 0;

  get clue() {
    return this.entity;
  }

  created() {
    this.store = "crmClue";
    this.id = this.$route.params.clueId;
    this.load();
  }

  load() {
    this.loadEntity({
      query: {
        extras: JSON.stringify({
          OAuth: ["avatar"],
          CrmClue: [
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
      },
    });
  }
}
</script>
<style lang="scss" scoped>
.clue-detail {
  padding: 10px;
  .header {
    margin-bottom: 10px;
  }
  .actions {
    background: rgba(255, 255, 255, 0.8);
    width: 100%;
    padding: 10px 10px 0px;

    display: flex;
    align-items: center;
    justify-content: space-between;

    & ::v-deep button {
      border: none;
    }
  }
}
</style>
