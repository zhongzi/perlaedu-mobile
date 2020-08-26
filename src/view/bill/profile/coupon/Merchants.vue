<template>
  <div class="wrapper merchants">
    <ai-list-stored
      v-show="total > 1"
      resource="merchant"
      :query="query"
      scrollType="slider"
      :sliderOptions="{ slidesPerView: 4, initialSlide: 0, freeMode: true }"
      :hideIfNoData="true"
      @emit-list="emitList"
    >
      <template v-slot:item="{ item }">
        <ai-state-check
          :checked="curMerchant && item.id === curMerchant.id"
          @update:checked="(v) => updateCurMerchant(item, v)"
          class="merchant"
        >
          <div class="cover">
            <img
              :src="
                item.cover_url | alioss({ width: 40, height: 30, mode: 'fill' })
              "
            />
          </div>
          <div class="info">
            <span class="name">{{ item.name }}</span>
          </div>
        </ai-state-check>
      </template>
    </ai-list-stored>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

import AiListStored from "@/view/component/AiListStored.vue";
import AiStateCheck from "@/view/component/AiStateCheck.vue";

@Component({
  components: {
    AiListStored,
    AiStateCheck,
  },
})
export default class Home extends Vue {
  total: number = 0;
  curMerchant: any = {};

  get query() {
    return {
      "BillCoupon.openid": this.$auth.user.openid,
      sort: "statistics.bill.coupon.count_accumulative desc",
      extras: "cover_url, statistics_bill_coupon_count_accumulative",
    };
  }

  emitList(res) {
    this.total = res.total;
  }

  updateCurMerchant(m, v) {
    this.curMerchant = v ? m : null;
    this.$emit("click", this.curMerchant);
  }
}
</script>
<style lang="scss" scoped>
.merchants {
  background: #fff;
  .merchant {
    position: relative;
    margin-left: 20px;
    margin-bottom: 20px;
    box-shadow: 0px 8px 14px 0px rgba(0, 0, 0, 0.06);

    min-height: 85px;
    max-height: 85px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;

    & ::v-deep .ai-state-check__icon {
      padding: 3p 3p 1px 1px;
      font-size: 10px;
    }

    .cover {
      flex: 1;
      img {
        width: 100%;
        border-radius: 5px;
      }
    }
    .info {
      text-align: center;
      border-radius: 0 0 10px 10px;
      background: rgba(255, 255, 255, 0.8);

      font-size: 11px;
      line-height: 1.5;

      width: 100%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}
</style>
