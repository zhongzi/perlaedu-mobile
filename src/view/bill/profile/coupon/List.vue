<template>
  <div class="wrapper coupons">
    <merchants @click="(m) => (curMerchant = m)" />
    <hui-tab v-model="curTabIdx" :tabs="tabs" label="label" />
    <div class="container">
      <bill-coupon-list
        :query="query"
        scrollHeight="70vh"
        couponClickedRoute="billProfileCouponDetail"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

import AiSearch from "@/view/component/AiSearch.vue";

import BillCouponList from "../../component/BillCouponList.vue";
import Merchants from "./Merchants.vue";

import isEmpty from "lodash/isEmpty";

@Component({
  components: {
    AiSearch,
    BillCouponList,
    Merchants,
  },
})
export default class Home extends Vue {
  tabs: any = [
    { label: "可用券", value: ["taken", "pending"] },
    { label: "已使用", value: "used" },
    { label: "过期券", value: ["expired", "canceled"] },
  ];

  curMerchant: any = {};
  curTabIdx: number = 0;
  keyword: string = "";

  get curTab() {
    return this.tabs[this.curTabIdx];
  }

  get query() {
    return {
      merchant_id: this.curMerchant && this.curMerchant.id,
      keyword: this.keyword,
      openid: this.$auth.user.openid,
      status: this.curTab.value,
      sort: "status asc, id desc",
      extras:
        "item,union,merchant, hashed_id, count_source_on_links, count_source",
    };
  }
}
</script>
<style lang="scss" scoped>
.coupons {
  width: 100%;
  margin: 20px 0px;

  & ::v-deep .h-tab_state-select {
    color: rgba(237, 139, 65, 1);
  }

  & ::v-deep .h-tab__item {
    font-size: 13px;
    font-family: Helvetica;
    height: 30px;
    letter-spacing: 1px;
  }

  & ::v-deep .h-tab__indicator-line {
    background-color: rgba(237, 139, 65, 1);
  }

  .header {
    min-height: 87px;
    display: flex;
    align-items: center;
    justify-content: space-around;

    .action {
      i {
        font-size: 1.5em;
        margin-right: 5px;
      }
    }
  }
  .container {
    background: #fff;
    padding: 10px 10px;
  }
}
</style>
