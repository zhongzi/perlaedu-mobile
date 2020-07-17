<template>
  <div class="wrapper">
    <div class="header">
      <ai-input-switchable v-model="title" @onBlur="submit" mode="switchable" />
    </div>
    <hui-tab-rounded
      class="tabs"
      v-model="curTabIdx"
      :tabs="tabs"
      label="label"
    />
    <div class="items">
      <ai-list-stored resource="billItem" :query="query" scrollHeight="60vh">
        <template v-slot:item="{ item, tag }">
          <bill-card-welfare
            v-if="item.is_welfare"
            :key="item.id"
            :item="item"
            :outerTag="tag"
            @modify="onModify(item, tag)"
            class="item"
          />
          <bill-card-payment
            v-else
            :key="item.id"
            :item="item"
            :outerTag="tag"
            @modify="onModify(item, tag)"
            class="item"
          />
        </template>
        <template v-slot:empty>
          <div style="text-align: center; padding: 20px 0px;">暂无数据</div>
        </template>
      </ai-list-stored>
      <ai-fixed-footer>
        <ai-button-plus class="plus" @click.native="onNewItem" />
      </ai-fixed-footer>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Mixins, Watch } from "vue-property-decorator";
import SyncMixin from "@/mixin/SyncMixin";

import AiButtonPlus from "@/view/component/AiButtonPlus.vue";
import AiListStored from "@/view/component/AiListStored.vue";
import AiInputSwitchable from "@/view/component/AiInputSwitchable.vue";
import AiFixedFooter from "@/view/component/AiFixedFooter.vue";

import BillCardWelfare from "../../component/BillCardWelfare.vue";
import BillCardPayment from "../../component/BillCardPayment.vue";

import cloneDeep from "lodash/cloneDeep";
import find from "lodash/find";
import indexOf from "lodash/indexOf";
import isEqual from "lodash/isEqual";
import _get from "lodash/get";

@Component({
  components: {
    AiInputSwitchable,
    AiButtonPlus,
    AiListStored,
    AiFixedFooter,
    BillCardWelfare,
    BillCardPayment,
  },
})
export default class Home extends Mixins(SyncMixin) {
  tabs: any = [
    { label: "优惠套餐", value: "pay" },
    { label: "福利", value: "welfare" },
  ];
  curTabIdx: number = 0;
  title: string = "";

  get curTab() {
    return this.tabs[this.curTabIdx];
  }

  get query() {
    return {
      project_id: this.id,
      is_welfare: this.curTab.value === "welfare",
    };
  }

  get project() {
    return this.entity;
  }

  created() {
    this.resetCurTabIdx();

    this.store = "billProject";
    this.id = this.$route.params.projectId;
    this.loadEntity({
      query: {
        extras: "channel",
      },
    });
  }

  @Watch("project", { deep: true })
  onProjectChanged() {
    this.title = this.project.title;
  }

  @Watch("curTab")
  onCurTabChanged() {
    if (this.$route.query.type === this.curTab.value) return;
    this.$router.replace({
      name: "billEditingItems",
      query: {
        type: this.curTab.value,
      },
    });
  }

  @Watch("$route", { deep: true })
  onRouteChanged() {
    this.resetCurTabIdx();
  }

  submit() {
    if (isEqual(this.title, this.project.title)) return;
    this.enableLoading = false;
    this.saveEntity({
      res: {
        id: this.id,
        title: this.title,
      },
    });
  }

  resetCurTabIdx() {
    this.curTabIdx = indexOf(
      this.tabs,
      find(this.tabs, { value: this.$route.query.type || "pay" })
    );
  }

  onNewItem() {
    this.$router.push({
      name: "billEditingItem",
      params: {
        itemId: "new",
      },
      query: {
        type: this.curTab.value,
      },
    });
  }

  onModify(item) {
    this.$router.push({
      name: "billEditingItem",
      params: {
        itemId: item.id,
      },
    });
  }
}
</script>
<style lang="scss" scoped>
.wrapper {
  padding: 20px;

  .header {
    display: flex;
    align-items: center;
    justify-content: space-around;

    min-height: 85px;
    margin-bottom: 10px;

    & ::v-deep .ai-input__input-e {
      font-size: 20px;
      font-weight: 600;
    }

    & ::v-deep .ai-input__label {
      font-size: 20px;
      font-weight: 600;
    }

    .plus {
      width: 80px;
      height: 60px;
    }
  }
  .items {
    .item {
      width: 100%;
      margin: 10px auto;
      border: none;
    }
  }
}
</style>
