<template>
  <div :class="b()">
    <label :class="b('title')" v-if="welfareItems.length > 0">
      优惠礼包:
    </label>
    <template v-for="item in welfareItems">
      <div :class="b('item')" :key="item.id">
        <div>
          <label> {{ item.vitem.title }}</label>
          <span
            v-if="
              $options.filters.safe(item, 'vitem.description', '').length > 0
            "
          >
            {{ item.vitem.description }}
          </span>
        </div>
        <span v-if="item.price > 0">
          订单总金额超过{{ item.min_balance }}元 立即享优惠金额
          {{ item.price }} 元
        </span>
        <span v-if="item.end_at">
          有效期: {{ item.start_at | defaultDate }} -
          {{ item.end_at | defaultDate }}
        </span>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

import filter from "lodash/filter";

@Component({
  name: "bill-order-items",
})
export default class Home extends Vue {
  @Prop({ type: Object }) order: any;

  get welfareItems() {
    let query: any = { is_welfare: true };
    if (!this.order.is_paying) {
      query.is_used = true;
    }
    return filter(this.order.items, query) || [];
  }
}
</script>
<style lang="scss" scoped>
.bill-order-items {
  margin-top: 10px;
  &__item {
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    span {
      font-size: 13px;
      color: rgba(165, 165, 165, 1);
      line-height: 17px;
      letter-spacing: 1px;
    }
  }
}
</style>
