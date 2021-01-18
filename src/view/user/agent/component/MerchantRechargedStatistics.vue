<template>
  <div class="wrapper statistics">
    <ai-datetime-picker-wrapper v-model="dateRange" />
    <ai-card class="container">
      <template v-slot:body>
        <div class="overview">
          <div class="left">
            <div class="label">总业绩</div>
            <div class="detail">
              <span class="number">
                {{ statistics | safe("sum_amount", 0) }}
              </span>
              <span class="unit"> 元 </span>
            </div>
          </div>
          <div class="right">
            <div class="record">
              <span> 首充: </span>
              <span> {{ statistics | safe("sum_first_recharge", 0) }} 元</span>
            </div>
            <div class="record">
              <span> 续费: </span>
              <span> {{ statistics | safe("sum_recharge", 0) }} 元</span>
            </div>
          </div>
        </div>
        <div class="numbers">
          <div class="number">
            <span> {{ statistics | safe("count_register", 0) }} </span>
            <span> 注册客户数 </span>
          </div>
          <ai-line mode="vertical" height="30px" />
          <div class="number">
            <span> {{ statistics | safe("count_first_recharge", 0) }} </span>
            <span> 首冲客户数 </span>
          </div>
          <ai-line mode="vertical" height="30px" />
          <div class="number">
            <span> {{ statistics | safe("count_recharge", 0) }} </span>
            <span> 续费客户数 </span>
          </div>
        </div>
      </template>
    </ai-card>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Mixins, Watch } from "vue-property-decorator";

import SynxMixin from "@/mixin/SyncMixin";

import AiCard from "@/view/component/AiCard.vue";
import AiLine from "@/view/component/AiLine.vue";
import AiDatetimePickerWrapper from "@/view/component/AiDatetimePickerWrapper.vue";

import isEmpty from "lodash/isEmpty";

@Component({
  components: {
    AiCard,
    AiLine,
    AiDatetimePickerWrapper,
  },
})
export default class Home extends Mixins(SynxMixin) {
  dateRange: any = null;

  get statistics() {
    return this.entity;
  }

  created() {
    this.store = "payOrderStatistics";
    this.load();
  }

  @Watch("dateRange", { deep: true })
  onDateRangeChanged() {
    this.load();
  }

  load() {
    if (isEmpty(this.dateRange)) return;

    this.id = `>=${this.dateRange[0].toISOString()}&<${this.dateRange[1].toISOString()}`;
    this.loadEntity({
      query: {
        "Merchant.agent_id": this.$auth.user.agent.id,
        status: "finished",
        type_: ["register", "first_recharge", "recharge"],
        extras: JSON.stringify({
          PayOrderStatistic: [
            "sum_amount",
            "sum_first_recharge",
            "sum_recharge",
            "count_register",
            "count_first_recharge",
            "count_recharge",
          ],
        }),
      },
    });
  }
}
</script>
<style lang="scss" scoped>
.statistics {
  margin: 10px 0px 0px;
  .container {
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
        .number {
          font-size: 36px;
          font-weight: 800;
          line-height: 1;
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
    .numbers {
      display: flex;
      align-items: center;
      justify-content: space-around;
      margin-top: 10px;

      .number {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        font-size: 13px;
        color: #9b9b9b;
      }
    }
  }
}
</style>
