<template>
  <div class="wrapper-dashboard">
    <div class="header">
      <ai-search v-model="keyword" placeholder="凭证/微信昵称/项目" />
      <hui-button type="primary" @click.native="open = true">
        <i class="iconfont icon-download" />
      </hui-button>
      <hui-button
        type="primary"
        @click.native="
          $router.push({
            name: 'billEditingProjects',
          })
        "
      >
        <i class="iconfont icon-plus" />
      </hui-button>
    </div>
    <hui-tab-rounded v-model="curTabIdx" :tabs="tabs" label="label" />
    <div class="container">
      <ai-list-stored resource="billOrder" :query="query" :height="500">
        <template v-slot:item="{ item, tag }">
          <bill-order
            :key="item.id"
            :item="item"
            :outerTag="tag"
            class="item"
          />
        </template>
      </ai-list-stored>
    </div>
    <hui-dialog v-model="open" class="date">
      <ai-input-date-range
        @confirm="(v) => onDownload(v)"
        @cancel="open = false"
        class="date-range"
      />
    </hui-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Mixins, Watch } from "vue-property-decorator";

import SyncMixin from "@/mixin/SyncMixin";

import AiSearch from "@/view/component/AiSearch.vue";
import AiListStored from "@/view/component/AiListStored.vue";
import AiFloatAction from "@/view/component/AiFloatAction.vue";
import AiInputDateRange from "@/view/component/AiInputDateRange.vue";

import BillOrder from "../component/BillOrder.vue";

import indexOf from "lodash/indexOf";
import find from "lodash/find";

@Component({
  components: {
    AiSearch,
    AiListStored,
    AiFloatAction,
    AiInputDateRange,
    BillOrder,
  },
})
export default class Home extends Mixins(SyncMixin) {
  tabs: any = [
    { label: "正在支付", value: "paying", dateKey: "created_at" },
    { label: "付款成功", value: "paid", dateKey: "paid_at" },
    { label: "核销完成", value: "used", dateKey: "used_at" },
  ];
  curTabIdx: number = 0;

  open: boolean = false;
  downloading: boolean = false;
  keyword: string = "";

  get curTab() {
    return this.tabs[this.curTabIdx];
  }

  get query() {
    return {
      keyword: this.keyword,
      status: this.tabs[this.curTabIdx].value,
      merchant_id: this.$auth.user.curr_merch_id,
      sort: `${this.curTab.dateKey} desc`,
      extras: JSON.stringify({
        BillOrder: [
          "vproject",
          "user",
          "seller",
          "items",
          "is_paying",
          "cost_items",
          "hashed_id",
          "project",
        ],
        BillOrderItem: ["vitem"],
        BillProject: ["channel"],
      }),
    };
  }

  created() {
    this.resetCurTabIdx();
    this.store = "billOrder";
  }

  @Watch("curTab")
  onCurTabChanged() {
    if (this.$route.query.type === this.curTab.value) return;
    this.$router.replace({
      name: "billManagementDashboard",
      query: {
        type: this.curTab.value,
      },
    });
  }

  @Watch("$route", { deep: true })
  onRouteChanged() {
    this.resetCurTabIdx();
  }

  resetCurTabIdx() {
    this.curTabIdx = indexOf(
      this.tabs,
      find(this.tabs, { value: this.$route.query.type || "paying" })
    );
  }

  onDownload(dateRange) {
    this.open = false;
    if (this.downloading) return;

    this.downloading = true;
    this.loadList({
      query: Object.assign({}, this.query, {
        trigger: true,
        [this.curTab.dateKey]: [`>=${dateRange[0]}`, `<${dateRange[1]}`],
      }),
      success: (resp) => {
        console.log(resp);
        this.$hui.toast.info(resp.data.message);
        this.downloading = false;
      },
      failure: (err) => {
        console.log(err);
        this.$hui.toast.info(err.response.data.message);
        this.downloading = false;
      },
    });
  }
}
</script>
<style lang="scss" scoped>
.wrapper-dashboard {
  width: 100%;
  background: linear-gradient(
    119deg,
    rgba(255, 146, 73, 1) 0%,
    rgba(226, 99, 14, 1) 100%
  );
  .header {
    min-height: 87px;
    display: flex;
    align-items: center;
    justify-content: space-around;

    & ::v-deep button {
      border-radius: 30%;
    }
  }
  .container {
    min-height: 70vh;
    background: #fff;
  }
  .actions {
    padding: 0px 0px 20px;
    .title {
      padding: 10px;
      font-size: 18px;
      font-weight: 600px;
    }

    .action {
      text-align: center;
      padding: 10px;
      font-size: 14px;
    }
  }
  .entry {
    color: #fff;
    background: rgba(255, 146, 73, 1);
  }
}

.date {
  & ::v-deep .h-dialog__dialog {
    width: 100% !important;
    height: 100%;
  }

  &-range {
    padding: 0px 20px;
    text-align: center;
  }
}
</style>
