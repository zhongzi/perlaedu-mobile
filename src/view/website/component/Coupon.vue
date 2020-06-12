<template>
  <div class="wrapper coupon">
    <ai-cell v-if="coupon">
      <template v-slot:title>
        <div class="title">
          <span> {{ coupon.title }} </span>
          <i class="iconfont icon-info" />
        </div>
      </template>
      <template v-slot:subtitle>
        <div class="price">
          <span> {{ coupon.price }} </span> 元
        </div>
      </template>
      <template v-slot:right>
        <hui-button @click.native="take" class="action"> 立即领取 </hui-button>
      </template>
    </ai-cell>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Mixins } from "vue-property-decorator";

import SyncMixin from "@/mixin/SyncMixin";

import AiCell from "@/view/component/AiCell.vue";

@Component({
  components: {
    AiCell,
  },
})
export default class Home extends Mixins(SyncMixin) {
  @Prop({ type: Object, default: null }) merchant: any;
  @Prop({ type: Object, default: null }) coupon: any;
  @Prop({ type: Object, default: null }) unionMerchant: any;

  take() {
    const unionId = this.unionMerchant ? this.unionMerchant.union_id : 0;
    this.saveEntity({
      res: {
        item_id: this.coupon.id,
        union_id: unionId,
        merchant_id: this.unionMerchant ? 0 : this.merchant.id,
        referrer_openid: this.$store.state.expose,
        issuer: {
          union_id: unionId,
          merchant_id: this.merchant.id,
          remark: "来自机构首页课时券领取",
        },
      },
      success: () => {
        this.$hui.toast.info("认领成功， 请到【我的】卡券列表查看使用");
      },
      failure: (error) => {
        this.$hui.toast.error(error.response.data.message);
      },
    });
  }

  created() {
    this.store = "billCoupon";
  }
}
</script>
<style lang="scss" scoped>
.coupon {
  background: linear-gradient(
    136deg,
    rgba(255, 207, 51, 1) 0%,
    rgba(255, 131, 6, 1) 100%
  );
  box-shadow: 0px 8px 14px 0px rgba(0, 0, 0, 0.06);
  border-radius: 8px;

  padding: 10px 20px;
  margin: 10px 27px;

  .title {
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(255, 245, 236, 1);
    line-height: 20px;
    text-shadow: 0px 8px 14px rgba(0, 0, 0, 0.06);
  }
  .price {
    font-size: 12px;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: rgba(255, 255, 255, 1);
    line-height: 17px;
    text-shadow: 0px 8px 14px rgba(0, 0, 0, 0.06);

    span {
      font-size: 36px;
      line-height: 50px;
      text-shadow: 0px 8px 14px rgba(0, 0, 0, 0.06),
        0px 4px 6px rgba(255, 143, 13, 0.4);
    }
  }
  .action {
    background: linear-gradient(
      132deg,
      rgba(255, 255, 255, 1) 0%,
      rgba(255, 255, 255, 0.55) 100%,
      rgba(255, 255, 255, 0.55) 100%
    );
    box-shadow: 0px 8px 14px 0px rgba(0, 0, 0, 0.06),
      0px 3px 4px 0px rgba(255, 153, 19, 0.52);
    border-radius: 6px;
    opacity: 0.96;
    border: none;

    font-size: 13px;
    font-family: MicrosoftYaHei;
    color: rgba(255, 122, 6, 1);
    line-height: 17px;
    text-shadow: 0px 8px 14px rgba(0, 0, 0, 0.06);
  }
}
</style>
