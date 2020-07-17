<template>
  <div class="wrapper actions">
    <div class="title">使用记录</div>
    <ai-list-stored
      resource="billCouponAction"
      :query="query"
      :height="800"
      scrollType="none"
    >
      <template v-slot:item="{ item }">
        <ai-cell class="action">
          <template v-slot:title>
            {{ item | safe("merchant.name", "") }}
            {{ item | safe("staff.realname", "") }}
          </template>
          <template v-slot:subtitle>
            <div>时间: {{ item.created_at | defaultDate }}</div>
            <div>备注: {{ item.remark }}</div>
          </template>
          <template v-slot:right>
            {{ getItemActionText(item) }}
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
  background: #fff;
  min-height: 68px;
  padding: 15px 10px;
  border-radius: 8px;
  box-shadow: 0px 8px 14px 0px rgba(0, 0, 0, 0.06);

  .title {
    font-weight: 600;
    line-height: 2;
  }
  .action {
    width: 100%;
    & ::v-deep .ai-cell__left-info-header-title {
      font-size: 12px;
    }
  }
}
</style>
