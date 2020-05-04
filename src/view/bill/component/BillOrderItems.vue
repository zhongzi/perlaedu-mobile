<template>
  <div :class="b()">
    <ai-list-stored
      resource="billOrderItem"
      :query="query"
      :enableScroll="false"
      :enableEmpty="false"
    >
      <template v-slot:header>
        <span :class="b('title')">
          优惠礼包:
        </span>
      </template>
      <template v-slot:item="{ item }">
        <div :class="b('item')" v-if="item.is_welfare && !item.is_used">
          <label> {{ item.vitem.title }}</label>
          <span
            v-if="
              $options.filters.safe(item, 'vitem.description', '').length > 0
            "
          >
            {{ item.vitem.description }}
          </span>
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
    </ai-list-stored>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch, Mixins } from "vue-property-decorator";

import SyncMixin from "@/mixin/SyncMixin";

import AiListStored from "@/view/component/AiListStored.vue";

@Component({
  name: "bill-order-items",
  components: {
    AiListStored,
  },
})
export default class Home extends Mixins(SyncMixin) {
  @Prop({ type: Object }) order: any;

  get query() {
    return {
      order_id: this.order.id,
      extras: "vitem",
    };
  }
}
</script>
<style lang="scss" scoped>
.bill-order-items {
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
