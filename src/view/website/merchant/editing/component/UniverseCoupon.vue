<template>
  <div class="wrapper editing-universe-coupon">
    <ai-cell class="header" :showBottomLine="false">
      <template v-slot:title>
        <span class="title"> 开启免费课时</span>
        <i class="iconfont icon-info title-icon" />
      </template>
      <template v-slot:subtitle>
        <span> 免费送好友课时各自得一张100元课时券</span>
      </template>
      <template v-slot:right>
        <ai-input-switch v-model="enableUniverseCoupon" />
      </template>
    </ai-cell>
    <ai-cell class="body" :showBottomLine="false">
      <template v-slot:left>
        <div class="left">
          <div class="title">
            <span>备用金</span>
            <i class="iconfont icon-info" />
          </div>
          <div class="money">
            <span> {{ merchant.balance }} </span>
            <span> 元</span>
          </div>
        </div>
      </template>
      <template v-slot:right>
        <div class="right">
          <div class="detail">
            <span> 资金明细</span>
            <i class="iconfont icon-direction" />
          </div>
          <div class="actions">
            <hui-button> 充值 </hui-button>
            <hui-button> 提现 </hui-button>
          </div>
        </div>
      </template>
    </ai-cell>
    <div class="numbers">
      <ai-number
        :num="merchant.count_universe_coupon_sent || 0"
        label="已送出"
      />
      <ai-number
        :num="merchant.count_universe_coupon_used || 0"
        label="已核销"
      />
    </div>
    <ai-line />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Mixins, Watch } from "vue-property-decorator";

import SyncMixin from "@/mixin/SyncMixin";

import AiButtonRoundSmall from "@/view/component/AiButtonRoundSmall.vue";
import AiInputSwitch from "@/view/component/AiInputSwitch.vue";
import AiCell from "@/view/component/AiCell.vue";
import AiCard from "@/view/component/AiCard.vue";
import AiNumber from "@/view/component/AiNumber.vue";
import AiLine from "@/view/component/AiLine.vue";

import _get from "lodash/get";

@Component({
  components: {
    AiCell,
    AiCard,
    AiNumber,
    AiButtonRoundSmall,
    AiInputSwitch,
    AiLine,
  },
})
export default class Home extends Mixins(SyncMixin) {
  @Prop({ type: Object, default: null }) merchant: any;

  enableUniverseCoupon: boolean = false;

  get merchantId() {
    return _get(this.merchant, "id");
  }

  get website() {
    return this.list[0] || {};
  }

  created() {
    this.store = "website";
    this.enableLoading = false;
    this.loadWebsite();
  }

  @Watch("merchant", { deep: true })
  onMerchantChanged() {
    this.loadWebsite();
    return;
  }

  @Watch("website", { deep: true })
  onWebsiteChanged() {
    if (this.enableUniverseCoupon === this.website.enable_universe_coupon)
      return;

    this.enableUniverseCoupon = this.website.enable_universe_coupon;
  }

  @Watch("enableUniverseCoupon", { deep: true })
  onEnableUniverseCoupon() {
    if (this.enableUniverseCoupon === this.website.enable_universe_coupon)
      return;
    this.saveWebsite();
  }

  saveWebsite() {
    this.id = this.website.id;
    this.saveEntity({
      res: {
        id: this.id,
        merchant_id: this.merchantId,
        enable_universe_coupon: this.enableUniverseCoupon,
      },
      success: () => {
        !this.id && this.loadWebsite();
      },
    });
  }

  loadWebsite() {
    if (!this.merchantId) return;

    this.loadList({
      query: {
        merchant_id: this.merchantId,
        limit: 1,
      },
    });
  }
}
</script>
<style lang="scss" scoped>
.editing-universe-coupon {
  .header {
    .title {
      font-size: 14px;
      font-weight: bold;
      color: rgba(84, 84, 84, 1);
      line-height: 19px;
      letter-spacing: 1px;
    }
    .title-icon {
      color: rgba(95, 95, 95, 0.55);
    }
  }

  .body {
    padding: 10px 0px;

    .left {
      .title {
        display: flex;
        align-items: center;
        line-height: 1.5;

        span {
          font-size: 13px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: rgba(74, 74, 74, 1);
          margin-right: 5px;
        }
        i {
          color: rgba(95, 95, 95, 0.55);
        }
      }
    }

    .money {
      span:nth-child(1) {
        font-size: 30px;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: rgba(74, 74, 74, 1);
        line-height: 42px;
        text-shadow: 0px 3px 14px rgba(0, 0, 0, 0.04);
      }
      span:nth-child(2) {
        font-size: 12px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: rgba(74, 74, 74, 1);
        line-height: 17px;
      }
    }
    .right {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      justify-content: flex-end;
      .detail {
        margin-bottom: 10px;
        span {
          font-size: 13px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: rgba(74, 74, 74, 1);
          line-height: 18px;
          margin-right: 5px;
        }
        i {
          color: rgba(212, 212, 212, 1);
        }
      }
    }
    .actions {
      button {
        border: none;

        font-size: 13px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(74, 74, 74, 1);
        line-height: 18px;

        &:nth-child(1) {
          margin-right: 10px;
        }
      }
    }
  }

  .numbers {
    display: flex;
    align-items: center;
    justify-content: space-around;

    margin-bottom: 10px;
  }
}
</style>
