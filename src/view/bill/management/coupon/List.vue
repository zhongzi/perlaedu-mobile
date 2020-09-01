<template>
  <div class="wrapper coupons">
    <div class="header">
      <ai-selection-stored
        class="items"
        v-model="curItemId"
        resource="billItem"
        :query="querySelection"
        :enableAllOption="true"
        :autoDefault="true"
      />
      <ai-selection-enum
        v-model="curStatus"
        :status="statusEnum"
        :enableAllOption="true"
        :autoDefault="true"
      />
      <hui-button type="primary" class="action" @click.native="exportXlxs">
        <i class="iconfont icon-download" />
        <span>导出</span>
      </hui-button>
    </div>
    <bill-coupon-list
      scrollHeight="80vh"
      :comp="curComp"
      :query="query"
      :showUser="true"
      :showActions="false"
      couponClickedRoute="billManagementCouponDetail"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Mixins } from "vue-property-decorator";

import SyncMixin from "@/mixin/SyncMixin";

import AiSelectionStored from "@/view/component/AiSelectionStored.vue";
import AiSelectionEnum from "@/view/component/AiSelectionEnum.vue";

import BillCouponList from "../../component/BillCouponList.vue";
import BillCouponM from "../../component/BillCouponM.vue";

import { BillCouponStatus } from "@/enum/bill_coupon_status";

import merge from "lodash/merge";

@Component({
  components: {
    BillCouponList,
    AiSelectionStored,
    AiSelectionEnum,
  },
})
export default class Home extends Mixins(SyncMixin) {
  curItemId: number = null;
  curStatus: string = null;
  curComp: any = BillCouponM;
  downloading: boolean = false;

  get statusEnum() {
    return BillCouponStatus;
  }

  get querySelection() {
    return {
      merchant_id: this.$auth.user.curr_merch_id,
    };
  }

  get query() {
    let q = merge(
      {
        project_id: 0,
        status: this.curStatus,
        extras: JSON.stringify({
          BillCoupon: [
            "user",
            "union",
            "merchant",
            "hashed_id",
            "item",
            "issue",
            "view_paths",
            "referrer",
          ],
          BillCouponAction: ["user"],
        }),
      },
      JSON.parse((this.$route.query.query as any) || "{}")
    );
    if (this.curItemId && this.curItemId > 0) {
      q.item_id = this.curItemId;
    }
    return q;
  }

  created() {
    this.store = "billCoupon";
  }

  exportXlxs() {
    if (this.downloading) {
      this.$hui.toast.info("正在下载, 请关注微信公众号消息");
      return;
    }

    this.downloading = true;
    this.loadList({
      reset: true,
      query: Object.assign(
        {},
        { trigger: true, include_count: true },
        this.query
      ),
      success: (resp) => {
        if (resp.data.total > 0) {
          this.$hui.toast.info(
            "数据报表请求正在处理， 稍后将以微信消息的方式通知您, 请注意查收"
          );
        } else {
          this.downloading = false;
          this.$hui.toast.info(
            "您本次请求数据为空，将不产生任何数据报表, 请调整必要的查询条件"
          );
        }
      },
    });
  }
}
</script>
<style lang="scss" scoped>
.coupons {
  padding: 20px 10px;
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .action {
      min-width: 70px;
    }
  }
}
</style>
