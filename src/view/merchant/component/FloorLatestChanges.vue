<template>
  <div class="wrapper floor-latest-changes">
    <floor title="近期动态">
      <div class="picker">
        <div class="detail">
          <i class="iconfont icon-date-range" />
          <div class="formater">
            <p>{{ dateRange[0] | defaultDay }}</p>
            <p>{{ dateRange[1] | defaultDay }}</p>
          </div>
          <i class="iconfont icon-funnel" @click="showPicker = true" />
        </div>
        <ai-datetime-unit-picker v-model="dateRange" class="quick" />
      </div>
      <div class="main">
        <template v-for="(data, index) in cellDatas">
          <floor-cell-trend
            :key="index"
            class="cell"
            :title="data.title"
            :numToUp="data.numToUp"
            :numToDown="data.numToDown"
            :decimal="data.decimal"
          />
        </template>
      </div>
    </floor>
    <ai-datetime-picker v-model="dateRange" :show.sync="showPicker" />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Mixins, Watch } from "vue-property-decorator";

import SyncMixin from "@/mixin/SyncMixin";

import AiDatetimePicker from "@/view/component/AiDatetimePicker.vue";
import AiDatetimeUnitPicker from "@/view/component/AiDatetimeUnitPicker.vue";

import Floor from "./Floor.vue";
import FloorCellTrend from "./FloorCellTrend.vue";

import _get from "lodash/get";
import isEmpty from "lodash/isEmpty";

@Component({
  components: {
    AiDatetimePicker,
    AiDatetimeUnitPicker,
    Floor,
    FloorCellTrend,
  },
})
export default class Home extends Mixins(SyncMixin) {
  @Prop({ type: Object, default: null }) merchant: any;

  dateRange: any = [];
  showPicker: boolean = false;

  get statistics() {
    return this.entity;
  }

  get cellDatas() {
    return [
      {
        title: "人科",
        numToUp: _get(this.statistics, "tag.count_incr_by_merchant", 0),
        numToDown: _get(this.statistics, "tag.count_decr_by_merchant", 0),
      },
      {
        title: "课时",
        numToUp: _get(
          this.statistics,
          "tag_transaction.sum_by_merchant.sum_lessons_incr",
          0
        ),
        numToDown: _get(
          this.statistics,
          "tag_transaction.sum_by_merchant.sum_lessons_decr",
          0
        ),
      },
      {
        title: "课时费",
        numToUp: _get(
          this.statistics,
          "tag_price_transaction.sum_by_merchant.sum_prices_incr",
          0
        ),
        numToDown: _get(
          this.statistics,
          "tag_price_transaction.sum_by_merchant.sum_prices_decr",
          0
        ),
        decimal: 2,
      },
      {
        title: "储值卡",
        numToUp: _get(
          this.statistics,
          "tag_transaction.sum_by_merchant.sum_cash_incr",
          0
        ),
        numToDown: _get(
          this.statistics,
          "tag_transaction.sum_by_merchant.sum_cash_decr",
          0
        ),
        decimal: 2,
      },
    ];
  }

  created() {
    this.store = "merchantStatistics";
    this.load();
  }

  @Watch("dateRange", { deep: true })
  onDateRangeChanged() {
    this.load();
  }

  @Watch("merchant", { deep: true })
  onMerchantChanged() {
    this.load();
  }

  load() {
    if (isEmpty(this.dateRange) || isEmpty(this.merchant)) return;

    this.id = `>=${this.dateRange[0].toISOString()}&<${this.dateRange[1].toISOString()}`;
    this.loadEntity({
      query: {
        related_id: this.merchant.id,
        extras: JSON.stringify({
          Merchant: ["statistics"],
          MerchantStatistic: [
            "tag",
            "tag_transaction",
            "tag_price_transaction",
          ],
          TagStatistic: ["count_decr_by_merchant", "count_incr_by_merchant"],
          TagTransactionStatistic: ["sum_by_merchant"],
          TagPriceTransactionStatistic: ["sum_by_merchant"],
        }),
      },
    });
  }
}
</script>
<style lang="scss" scoped>
.floor-latest-changes {
  .picker {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;

    .detail {
      display: flex;
      align-items: center;
      justify-content: space-between;

      .formater {
        font-size: 12px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #4a4a4a;
        line-height: 17px;
      }

      & i:nth-child(1) {
        font-size: 20px;
        padding: 3px;
      }

      & i:nth-child(3) {
        font-size: 20px;
        color: rgba(252, 142, 68, 0.8);
        background: #fff;
        padding: 3px;
        margin-left: 5px;
      }
    }

    .quick {
      width: 55%;
    }
  }

  .main {
    display: flex;
    align-items: center;
    flex-wrap: wrap;

    .cell {
      width: 49%;
      margin-top: 10px;

      &:not(:nth-child(2n)) {
        margin-right: 2%;
      }
    }
  }
}
</style>
