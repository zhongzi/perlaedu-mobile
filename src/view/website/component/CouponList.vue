<template>
  <div class="wrapper coupon">
    <coupon v-if="coupon.id" :coupon="coupon" :merchant="merchant" />
    <hui-dialog v-model="showDialog" v-show="enabled">
      <div class="dialog" :style="dlgStyle">
        <div class="cover" v-if="merchant.cover_url">
          <img :src="merchant.cover_url | alioss({ width: 125, height: 85 })" />
        </div>
        <div class="title">
          <span>{{ merchant.name }}</span>
          <span>送您的专属礼包</span>
        </div>
        <div class="links">
          <template v-for="link in links">
            <coupon-simple
              :coupon="link.target"
              class="link"
              :key="link.target_id"
            />
          </template>
          <ai-input
            v-if="coupon.is_takeable"
            placeholder="请输入您的手机号码领取礼包"
            v-model="telephone"
            class="telephone"
          />
        </div>
        <hui-button class="action" @click.native="take" :style="btnStyle">
          {{ coupon.is_takeable ? "收下去使用" : "已领取, 前往卡包使用" }}
        </hui-button>
      </div>
    </hui-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch, Mixins } from "vue-property-decorator";

import SyncMixin from "@/mixin/SyncMixin";
import StopBodyScrollMixin from "@/mixin/StopBodyScrollMixin";

import AiInput from "@/view/component/AiInput.vue";
import AiListStored from "@/view/component/AiListStored.vue";
import Coupon from "./Coupon.vue";
import CouponSimple from "./CouponSimple.vue";

import merge from "lodash/merge";
import find from "lodash/find";
import _get from "lodash/get";
import isEmpty from "lodash/isEmpty";

@Component({
  components: {
    AiInput,
    AiListStored,
    Coupon,
    CouponSimple,
  },
})
export default class Home extends Mixins(SyncMixin) {
  @Prop({ type: Object, default: null }) merchant: any;
  @Prop({ type: Boolean, default: true }) enableDialog: boolean;

  showDialog: boolean = false;
  telephone: string = "";

  get coupon() {
    return this.entity;
  }

  get links() {
    return this.coupon.links || [];
  }

  get enabled() {
    if (!this.enableDialog) {
      return false;
    }
    if (isEmpty(this.links)) {
      return false;
    }
    return this.showDialog;
  }

  get couponId() {
    if (!this.merchant || !_get(this.merchant, "website.coupon_enabled")) {
      return 0;
    }
    const um = _get(this.merchant, "union_merchant");
    if (um && um.coupon_enabled && um.coupon_id > 0) {
      return um.coupon_id;
    }
    if (this.merchant.website.coupon_id > 0) {
      return this.merchant.website.coupon_id;
    }
    return this.$configs.gBillCouponId || 0;
  }

  get dlgStyle() {
    return {
      backgroundImage:
        "url(" +
        require("@/asset/image/dlg-coupon-bg" + this.$densityStr + ".png") +
        ")",
    };
  }

  get btnStyle() {
    return {
      backgroundImage:
        "url(" + require("@/asset/image/btn" + this.$densityStr + ".png") + ")",
    };
  }

  created() {
    this.store = "billItem";
    this.load();

    this.$bus.$on("website:coupon:dialog:show", (show) => {
      this.showDialog = show;
    });

    this.$bus.$on("website:coupon:taked", () => {
      this.commitChanges(this.couponId, { is_takeable: false });
    });
  }

  @Watch("couponId")
  onCouponIdChanged() {
    this.load();
  }

  @Watch("coupon")
  onCouponChanged() {
    this.showDialog = this.coupon.is_takeable;
  }

  take() {
    if (!this.coupon.is_takeable) {
      this.showDialog = false;
      this.$router.push({
        name: "billProfileHome",
      });
      return;
    }

    if (isEmpty(this.telephone) || !/^1[3456789]\d{9}$/.test(this.telephone)) {
      this.$hui.toast.error("请填写正确的手机号码");
      return;
    }
    this.$bus.$emit("website:coupon:take", {
      coupon: this.coupon,
      telephone: this.telephone,
    });
  }

  load() {
    this.id = this.couponId;
    this.loadEntity({
      query: {
        extras: JSON.stringify({
          BillItem: ["is_takeable", "links"],
          BillItemLink: ["target"],
        }),
      },
    });
  }
}
</script>

<style lang="scss" scoped>
.coupon {
  & ::v-deep .h-dialog__dialog {
    background: inherit;
    width: 100% !important;
  }

  .dialog {
    position: relative;
    background-origin: border-box;
    background-size: cover;
    text-align: center;
    border-radius: 6px;
    width: 100%;
    min-height: 500px;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;

    .cover {
      position: absolute;
      top: -25px;
      left: calc(50% - 62.5px);
      width: 125px;
      height: 85px;
      border-radius: 4px;
      overflow: hidden;
      border: solid 2px #fff;

      img {
        border-radius: 4px;
        width: 100%;
        height: 100%;
      }
    }

    .title {
      font-size: 20px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: rgba(255, 255, 255, 1);
      line-height: 1.3;
      text-shadow: 0px 2px 4px rgba(218, 77, 25, 1);

      padding-top: 70px;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    .links {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      margin-top: 15px;

      .link {
        margin-bottom: 10px;
      }
    }
    .telephone {
      background: #fff;
      border-radius: 8px;
      width: 100%;

      & ::v-deep .ai-input__input {
        font-size: 14px;
        font-family: FZLTZHK--GBK1-0, FZLTZHK--GBK1;
        font-weight: normal;
        color: rgba(155, 155, 155, 1);
        line-height: 19px;
        text-align: center;
        padding: 5px 0px;
        border-radius: 8px;
      }
    }
    .action {
      background-size: cover;
      background-color: inherit;
      border: none;

      width: 280px;
      height: 70px;

      font-size: 18px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: rgba(175, 75, 4, 1);
      line-height: 30px;
      text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.26);
      padding-bottom: 15px;

      margin-top: 20px;
      margin-bottom: 50px;
    }
  }
}
</style>
