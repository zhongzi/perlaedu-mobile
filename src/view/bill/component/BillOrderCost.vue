<template>
  <div :class="b()">
    <ai-list-stored resource="billOrderCost" :query="query" scrollType="none">
      <template v-slot:header>
        <span :class="b('title')"> 核销记录: </span>
      </template>
      <template v-slot:item="{ item }">
        <div :class="b('item')">
          <label>
            {{ item.updated_at | defaultDate }}
            {{ getCostTitle(item) }} 充值{{ item.balance }}元 备注
            {{ item.remark }}
          </label>
        </div>
      </template>
    </ai-list-stored>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch, Mixins } from "vue-property-decorator";

import SyncMixin from "@/mixin/SyncMixin";

import AiListStored from "@/view/component/AiListStored.vue";

@Component({
  name: "bill-order-cost",
  components: {
    AiListStored,
  },
})
export default class Home extends Mixins(SyncMixin) {
  @Prop({ type: Object }) order: any;

  get query() {
    return {
      order_id: this.order.id,
      extras: "target",
    };
  }

  getCostTitle(cost) {
    if (cost.target_class === "Merchant") {
      return cost.target.name;
    }
  }
}
</script>
<style lang="scss" scoped>
.bill-order-cost {
  padding: 30px 15px;
  &__item {
    display: flex;
    align-items: center;
    justify-content: space-between;

    font-size: 13px;
    line-height: 17px;
    letter-spacing: 1px;

    padding: 10px;

    span {
      color: rgba(165, 165, 165, 1);
    }
  }
}
</style>
