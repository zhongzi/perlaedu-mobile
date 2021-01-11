<template>
  <div class="wrapper profit">
    <ai-card class="header">
      <template v-slot:body>
        <div class="overview">
          <div class="left">
            <div class="label">过往累计收益</div>
            <div class="detail">
              <span class="number">{{ commissionTotal }}</span>
              <span class="unit">元</span>
            </div>
          </div>
          <div class="right">
            <div class="record">
              <span> 首充: </span>
              <span> {{ sums | safe("commission_first", 0) }} 元</span>
            </div>
            <div class="record">
              <span> 续费: </span>
              <span> {{ sums | safe("commission_renew", 0) }} 元</span>
            </div>
          </div>
        </div>
      </template>
    </ai-card>
    <div class="detail">
      <ai-line-header>
        <span class="label">每月收益</span>
      </ai-line-header>
      <ai-list-stored
        resource="agentRankLogStatistics"
        :query="query"
        @emit-list="onListChanged"
      >
        <template v-slot:item="{ item }">
          <profit-cell :profit="item" :key="item.id" />
        </template>
      </ai-list-stored>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

import AiCard from "@/view/component/AiCard.vue";
import AiLineHeader from "@/view/component/AiLineHeader.vue";
import AiListStored from "@/view/component/AiListStored.vue";

import ProfitCell from "./ProfitCell.vue";

import _get from "lodash/get";
import parseISO from "date-fns/parseISO";

@Component({
  components: {
    AiCard,
    AiLineHeader,
    AiListStored,
    ProfitCell,
  },
})
export default class Home extends Vue {
  sums: any = null;

  get commissionTotal() {
    return (
      _get(this.sums, "commission_first", 0) +
      _get(this.sums, "commission_renew", 0)
    );
  }

  get query() {
    const startAt = parseISO(_get(this.$auth, "user.agent.created_at"));
    const endAt = new Date();
    return {
      scope: `>=${startAt.toISOString()}&<${endAt.toISOString()}`,
      scope_type: "month",
      sort: "key",
      extras: "sum_by_commission_first,sum_by_commission_renew",
      sums: "commission_first,commission_renew",
    };
  }

  onListChanged({ list, tag, total, sums, counts }) {
    this.sums = sums;
  }
}
</script>
<style lang="scss" scoped>
.profit {
  .header {
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-top: 5px;
    padding: 15px;

    .overview {
      display: flex;
      padding: 0px 15px;
      align-items: flex-end;

      .left {
        display: flex;
        flex-direction: column;
        margin-right: 25px;
        .label {
          font-size: 15px;
          color: #9b9b9b;
        }
        .detail {
          font-weight: 800;
          .number {
            font-size: 36px;
            line-height: 1;
          }
        }
      }
      .right {
        display: flex;
        flex-direction: column;
        .record {
          font-size: 14px;
          color: #9b9b9b;
        }
      }
    }
  }
  .detail {
    .label {
      font-size: 16px;
      font-weight: 600;
      line-height: 3;
    }
  }

  & ::v-deep .ai-infinite-scroll__list {
    flex-direction: column;
    align-items: inherit;
  }
}
</style>
