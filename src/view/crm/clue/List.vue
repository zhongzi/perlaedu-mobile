<template>
  <div class="wrapper clues">
    <hui-tab-rounded v-model="curTabIdx" :tabs="tabs" label="label" />
    <ai-list-stored resource="crmClue" :query="query">
      <template v-slot:item="{ item, tag }">
        <crm-clue :clue="item" :outerTag="tag" :isInDetail="false" />
      </template>
    </ai-list-stored>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Mixins } from "vue-property-decorator";

import AiSelectionStored from "@/view/component/AiSelectionStored.vue";
import AiSelectionEnum from "@/view/component/AiSelectionEnum.vue";
import AiListStored from "@/view/component/AiListStored.vue";

import { CrmClueStatus } from "@/enum/crm_clue_status";

import CrmClue from "./component/CrmClue.vue";

import merge from "lodash/merge";
import isEmpty from "lodash/isEmpty";

@Component({
  components: {
    AiListStored,
    AiSelectionStored,
    AiSelectionEnum,
    CrmClue,
  },
})
export default class Home extends Vue {
  tabs: any = [
    { label: "新线索", value: "pending" },
    { label: "跟踪中", value: "following" },
    { label: "待分配", value: "restoring" },
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
    };
  }
}
</script>
<style lang="scss" scoped>
.clues {
  padding: 20px 10px;
}
</style>
