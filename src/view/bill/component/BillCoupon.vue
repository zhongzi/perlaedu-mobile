<template>
  <div :class="b()" :style="couponStyle" @click="openCoupon">
    <div :class="b('header')">
      <div :class="b('header-left')">
        <div :class="b('header-left-value')">
          <span>{{ coupon | safe("item.value") }}</span>
          <span>{{ valueType }}</span>
        </div>
        <div :class="b('header-left-title')">
          {{ coupon | safe("item.title") }}
        </div>
      </div>
      <div :class="b('header-right')">
        <template v-if="isTaken">
          <bill-button
            v-if="!isInDetail"
            label="立即使用"
            :enableIcon="false"
            :class="b('header-right-btn')"
          />
        </template>
        <template v-else-if="isPending">
          <bill-button
            v-if="!isInDetail"
            label="激活"
            :enableIcon="false"
            :class="b('header-right-btn')"
          />
        </template>
        <template v-else>
          <img :src="statusImg" />
        </template>
      </div>
    </div>
    <div :class="b('footer')">
      <div :class="b('footer-left')">
        <template v-if="origin">
          <img
            :src="origin.cover_url | alioss({ width: 20, height: 15 })"
            @click.stop="openOrigin"
          />
          <span @click.stop="openOrigin">
            {{ origin.name }}
          </span>
        </template>
      </div>
      <div :class="b('footer-right')">
        <template v-if="isPending">
          <span class="progress">
            进度:
            {{
              ((coupon.count_source * 100) / coupon.count_source_on_links)
                | round(2)
            }}
            %
          </span>
        </template>
        <template v-else>
          <template v-if="coupon.end_at">
            有效期至 {{ coupon.end_at | defaultDay }}
          </template>
          <template v-else>
            有效
          </template>
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Mixins, Watch } from "vue-property-decorator";

import SyncMixin from "@/mixin/SyncMixin";

import BillButton from "./BillButton.vue";

import { BillCouponStatus } from "@/enum/bill_coupon_status";
import { BillItemValueType } from "@/enum/bill_item_value_type";

import isEmpty from "lodash/isEmpty";

@Component({
  name: "bill-coupon",
  components: {
    BillButton,
  },
})
export default class Home extends Mixins(SyncMixin) {
  @Prop({ type: Object, default: null }) coupon: any;

  get couponStyle() {
    return this.coupon.id
      ? {
          backgroundImage:
            "url(" +
            require("@/asset/image/coupon-bg" +
              (this.isPending ? "-pending" : "") +
              this.$densityStr +
              ".png") +
            ")",
        }
      : {};
  }

  get isTaken() {
    return this.status === BillCouponStatus.taken;
  }

  get isPending() {
    return this.status === BillCouponStatus.pending;
  }

  get statusImg() {
    return (
      this.coupon.status &&
      require("@/asset/image/s-" +
        this.coupon.status +
        this.$densityStr +
        ".png")
    );
  }

  get status() {
    return BillCouponStatus[this.coupon.status];
  }

  get valueType() {
    if (isEmpty(this.coupon.item)) return "";

    const valueType = BillItemValueType[this.coupon.item.value_type];
    return valueType.unit;
  }

  get origin() {
    return this.coupon.merchant || this.coupon.union;
  }

  get isInDetail() {
    return (
      ["billProfileCouponDetail", "billManagementCouponDetail"].indexOf(
        this.$route.name
      ) >= 0
    );
  }

  openOrigin() {
    if (this.coupon.merchant) {
      this.$router.push({
        name: "websiteMerchant",
        params: {
          merchantId: this.coupon.merchant.id,
        },
      });
      return;
    }
    if (this.coupon.union) {
      this.$router.push({
        name: "websiteUnion",
        params: {
          unionId: this.coupon.union.id,
        },
      });
      return;
    }
  }

  openCoupon() {
    const routeName = "billProfileCouponDetail";
    if (this.$route.name === routeName) {
      this.$emit("click");
    } else {
      this.$router.push({
        name: routeName,
        params: {
          couponId: this.coupon.id,
        },
      });
    }
  }
}
</script>
<style lang="scss" scoped>
.bill-coupon {
  width: 100%;
  height: 130px;
  background-size: cover;
  background-origin: border-box;
  padding: 10px 30px 25px;

  display: flex;
  flex-direction: column;
  justify-content: space-between;

  &__header {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;

    &-left {
      flex: 2;
      min-width: 0px;

      display: flex;
      justify-content: space-between;
      align-items: center;

      font-size: 18px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: rgba(255, 255, 255, 1);
      line-height: 25px;
      text-shadow: 0px 6px 12px rgba(254, 196, 77, 0.44),
        0px 4px 4px rgba(255, 143, 13, 0.4);

      &-value {
        width: 100px;
        span:nth-child(1) {
          font-size: 36px;
        }
      }
      &-title {
        width: calc(100% - 100px);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }

    &-right {
      &-btn {
        float: right;
        height: 35px;
      }

      .progress {
        float: right;
        font-size: 18px;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: rgba(255, 255, 255, 1);
        line-height: 25px;
        text-shadow: 0px 6px 12px rgba(254, 196, 77, 0.44),
          0px 4px 4px rgba(255, 143, 13, 0.4);
      }

      img {
        float: right;
        width: 70px;
      }
    }
  }

  &__footer {
    display: flex;
    align-items: center;
    justify-content: space-between;

    &-left {
      display: flex;
      align-items: center;
      flex: 1;

      img {
        max-width: 35px;
        max-height: 25px;
        border: 2px solid #fff;
        border-radius: 3px;
        display: block;
      }

      span {
        margin-left: 5px;
        font-size: 13px;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: rgba(255, 255, 255, 0.8);
        line-height: 18px;
        text-shadow: 0px 6px 12px rgba(254, 196, 77, 0.44);

        max-width: 120px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
    &-right {
      font-size: 13px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: rgba(182, 103, 14, 1);
      line-height: 18px;
      text-shadow: 0px 6px 12px rgba(254, 196, 77, 0.44);

      .progress {
        color: #fff;
      }
    }
  }
}
</style>
