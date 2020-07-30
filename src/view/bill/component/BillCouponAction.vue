<template>
  <div class="wrapper actions">
    <ai-list-stored
      resource="billCouponAction"
      :query="query"
      scrollType="none"
    >
      <template v-slot:item="{ item }">
        <ai-cell class="action">
          <template v-slot:subtitle>
            <span>{{ item.created_at | date("MM-dd HH:mm") }} </span>
            <span>{{ item | safe("merchant.name", "") }} </span>
            <span>{{ getItemActionText(item) }} </span>
          </template>
        </ai-cell>
      </template>
    </ai-list-stored>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

import AiListStored from "@/view/component/AiListStored.vue";
import AiCell from "@/view/component/AiCell.vue";

import { BillCouponStatus } from "@/enum/bill_coupon_status";

import _get from "lodash/get";

@Component({
  components: {
    AiListStored,
    AiCell,
  },
})
export default class Home extends Vue {
  @Prop({ type: Object, default: null }) coupon: any;

  get query() {
    return {
      coupon_id: _get(this.coupon, "id", 0),
      extras: "merchant, union, user",
    };
  }

  getItemActionText(item) {
    return _get(BillCouponStatus[item.action], "text", "");
  }
}
</script>
<style lang="scss" scoped>
.actions {
  min-height: 68px;
  padding: 15px 10px;
  border-radius: 8px;

  .action {
    width: 100%;
    min-height: 25px;
    & ::v-deep .ai-cell__left-info-header-title {
      font-size: 12px;
    }
  }
}
</style>
