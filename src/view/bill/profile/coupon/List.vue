<template>
  <div class="wrapper coupons">
    <hui-tab-rounded v-model="curTabIdx" :tabs="tabs" label="label" />
    <div class="container">
      <ai-list-stored resource="billCoupon" :query="query">
        <template v-slot:item="{ item, tag }">
          <bill-coupon
            :key="item.id"
            :coupon="item"
            :outerTag="tag"
            class="item"
          />
        </template>
      </ai-list-stored>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

import AiListStored from "@/view/component/AiListStored.vue";
import AiSearch from "@/view/component/AiSearch.vue";

import BillCoupon from "../../component/BillCoupon.vue";

import isEmpty from "lodash/isEmpty";

@Component({
  components: {
    AiListStored,
    AiSearch,
    BillCoupon,
  },
})
export default class Home extends Vue {
  tabs: any = [
    { label: "可用券", value: "taken" },
    { label: "已使用", value: "used" },
    { label: "过期券", value: ["expired", "canceled"] },
    { label: "全部", value: null },
  ];

  curTabIdx: number = 0;
  keyword: string = "";

  get curTab() {
    return this.tabs[this.curTabIdx];
  }

  get query() {
    return {
      scope: "merchant",
      keyword: this.keyword,
      openid: this.$auth.user.openid,
      status: this.curTab.value,
      extras: "item,union,merchant, hashed_id",
    };
  }

  onClick() {
    this.$hui.toast.info("即将开通， 敬请关注");
  }
}
</script>
<style lang="scss" scoped>
.coupons {
  width: 100%;
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
    padding: 0px 20px;
    min-height: 80vh;
  }
}
</style>
