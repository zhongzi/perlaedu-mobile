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
        @selected="(o) => (curItem = o)"
      />
      <ai-selection-enum
        v-model="curStatusId"
        :status="statusEnum"
        :enableAllOption="true"
        :autoDefault="true"
        @selected="(o) => (curStatus = o)"
      />
      <hui-button type="primary" class="action" @click.native="confirm">
        <i class="iconfont icon-download" />
        <span>下载</span>
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
import isEmpty from "lodash/isEmpty";

@Component({
  components: {
    BillCouponList,
    AiSelectionStored,
    AiSelectionEnum,
  },
})
export default class Home extends Mixins(SyncMixin) {
  curItemId: number | string = "";
  curItem: any = null;
  curStatusId: string = "taken";
  curStatus: any = null;
  curComp: any = BillCouponM;
  downloading: boolean = false;

  get statusEnum() {
    return BillCouponStatus;
  }

  get querySelection() {
    return {
      merchant_id: this.$route.query.merchantId,
    };
  }

  get query() {
    return merge(
      {
        item_id: isEmpty(this.curItemId) ? null : this.curItemId,
        merchant_id: this.$route.query.merchantId,
        project_id: 0,
        status: this.curStatusId,
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
  }

  created() {
    this.store = "billCoupon";
  }

  confirm() {
    if (this.downloading) {
      this.$hui.toast.info("正在下载, 请关注微信公众号消息");
      return;
    }

    this.$hui.confirm.show({
      title: "下载确认",
      message: `您正在下载 [${this.curItem.title}] 卡券处于 [${this.curStatus.key}] 状态记录明细, 是否继续下载?`,
      confirmText: "确认",
      cancelText: "取消",
      onConfirm: () => {
        this.exportXlxs();
      },
    });
  }

  exportXlxs() {
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
    background: #fff;
    padding-right: 5px;

    display: flex;
    align-items: center;
    justify-content: space-between;

    .action {
      min-width: 70px;
    }
  }
}
</style>
