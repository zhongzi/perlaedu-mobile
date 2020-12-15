<template>
  <ai-cell
    class="cell"
    :title="profit.created_at | date('yyyy年MM月')"
    :subtitle="profitDetail"
  >
    <template v-slot:right>
      <div class="info">{{ profitTotal }} 元</div>
    </template>
  </ai-cell>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

import AiCell from "@/view/component/AiCell.vue";
import { PayOrderType } from "@/enum/pay_order";

import _get from "lodash/get";

@Component({
  components: {
    AiCell,
  },
})
export default class Home extends Vue {
  @Prop({ type: Object, default: null }) profit;

  get profitTotal() {
    return this.profit.commission_first + this.profit.commission_renew;
  }

  get profitDetail() {
    return `首冲收益 ${this.profit.commission_first}元 + 续费收益 ${this.profit.commission_renew}元`;
  }
}
</script>
<style lang="scss" scoped>
.cell {
  margin: 0px 0px 10px;
  padding: 10px 15px;
  background: #fff;
  border-radius: 8px;

  .info {
    text-align: right;
  }
}
</style>
