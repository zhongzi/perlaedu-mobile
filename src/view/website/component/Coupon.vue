<template>
  <div class="wrapper coupon">
    <ai-cell v-if="coupon">
      <template v-slot:title>
        <div class="title">
          <span> {{ coupon.title }} </span>
          <i class="iconfont icon-info" @click="showDialog = true" />
        </div>
      </template>
      <template v-slot:subtitle>
        <div class="value" v-if="valueType">
          <span> {{ coupon.value }} </span>
          {{ valueType.unit }}
        </div>
      </template>
      <template v-slot:right>
        <hui-button @click.native="openDialog" class="action">
          {{ coupon.is_takeable ? "立即领取" : "我的卡包" }}
        </hui-button>
      </template>
    </ai-cell>
    <hui-dialog v-model="showDialog">
      <div class="dialog" :style="dlgStyle">
        <div class="cover" v-if="merchant.cover_url">
          <img :src="merchant.cover_url | alioss({ width: 125, height: 85 })" />
        </div>
        <div class="title">
          <span>{{ merchant.name }}</span>
          <span>{{ coupon.title }}</span>
        </div>
        <div class="links">
          <template v-for="link in links">
            <coupon-simple
              :coupon="link.target"
              class="link"
              :key="link.target_id"
              v-if="!link.is_refer"
            />
          </template>
          <ai-input
            v-if="coupon.is_takeable"
            placeholder="请输入您的手机号码领取礼包"
            v-model="telephone"
            class="telephone"
          />
        </div>
        <hui-button class="action" @click.native="save" :style="btnStyle">
          {{ coupon.is_takeable ? "收下去使用" : "已领取, 前往卡包使用" }}
        </hui-button>
      </div>
    </hui-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Mixins, Watch } from "vue-property-decorator";

import SyncMixin from "@/mixin/SyncMixin";

import AiInput from "@/view/component/AiInput.vue";
import AiCell from "@/view/component/AiCell.vue";
import CouponSimple from "./CouponSimple.vue";

import { BillItemValueType } from "@/enum/bill_item_value_type";

import _get from "lodash/get";
import isEmpty from "lodash/isEmpty";

@Component({
  components: {
    AiInput,
    AiCell,
    CouponSimple,
  },
})
export default class Home extends Mixins(SyncMixin) {
  @Prop({ type: Object, default: null }) merchant: any;
  @Prop({ type: Object, default: null }) coupon: any;
  @Prop({ type: Boolean, default: true }) enableDialog: boolean;

  showDialog: boolean = false;
  telephone: string = "";

  get links() {
    return this.coupon.links || [];
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

  get valueType() {
    return BillItemValueType[this.coupon.value_type];
  }

  @Watch("coupon")
  onCouponChanged() {
    this.showDialog = this.coupon.is_takeable;
  }

  openDialog() {
    if (!this.coupon.is_takeable) {
      this.openBag();
      return true;
    }

    this.showDialog = true;
    return false;
  }

  openBag() {
    this.$router.push({
      name: "billProfileHome",
    });
    return true;
  }

  save() {
    if (this.openDialog()) return;

    if (isEmpty(this.telephone) || !/^1[3456789]\d{9}$/.test(this.telephone)) {
      this.$hui.toast.error("手机号码作为核销唯一凭证， 请正确填写且不可为空");
      return;
    }

    const unionId = _get(this.merchant, "union_merchant.union_id", 0);
    this.saveEntity({
      res: {
        item_id: this.coupon.id,
        union_id: unionId,
        merchant_id: this.merchant.id,
        telephone: this.telephone,
        referrer_openid: this.$store.state.expose2,
        issuer: {
          union_id: unionId,
          merchant_id: this.merchant.id,
          remark: "来自机构首页课时券领取",
        },
      },
      success: () => {
        this.showDialog = false;
        this.$hui.toast.info("认领成功， 正在跳转请稍后...");
        setTimeout(() => {
          this.openBag();
        }, 3000);
      },
      failure: (error) => {
        this.$hui.toast.error(error.response.data.message);
      },
    });
  }

  created() {
    this.store = "billCoupon";
    this.showDialog = this.coupon.is_takeable;
    this.telephone = _get(this.$auth, "user.phone");
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
  box-shadow: 0px 8px 14px 0px rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  padding: 10px;

  .title {
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(255, 245, 236, 1);
    line-height: 20px;
    text-shadow: 0px 8px 14px rgba(0, 0, 0, 0.06);
  }
  .value {
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
    border-radius: 6px;
    opacity: 0.96;
    border: none;

    font-size: 13px;
    font-family: MicrosoftYaHei;
    color: rgba(255, 122, 6, 1);
    line-height: 17px;
    text-shadow: 0px 8px 14px rgba(0, 0, 0, 0.06);
  }

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

      margin-top: 10px;
      margin-bottom: 40px;
    }
  }
}
</style>
