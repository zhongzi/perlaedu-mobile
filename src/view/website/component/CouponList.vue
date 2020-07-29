<template>
  <div class="wrapper coupon">
    <coupon v-if="coupon.id" :coupon="coupon" :merchant="merchant" />
    <hui-dialog v-model="showDialog" v-if="enabled">
      <div class="dialog">
        <div class="title">{{ coupon.title }}</div>
        <div class="links">
          <template v-for="link in links">
            <coupon-simple
              :coupon="link.target"
              class="link"
              :key="link.target_id"
            />
          </template>
        </div>
        <div class="remark">白给的优惠干嘛不用</div>
        <hui-button class="action" @click.native="take">
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

import AiListStored from "@/view/component/AiListStored.vue";
import Coupon from "./Coupon.vue";
import CouponSimple from "./CouponSimple.vue";

import merge from "lodash/merge";
import find from "lodash/find";
import _get from "lodash/get";
import isEmpty from "lodash/isEmpty";

@Component({
  components: {
    AiListStored,
    Coupon,
    CouponSimple,
  },
})
export default class Home extends Mixins(SyncMixin) {
  @Prop({ type: Object, default: null }) merchant: any;
  @Prop({ type: Boolean, default: true }) enableDialog: boolean;

  showDialog: boolean = false;

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
    this.$bus.$emit("website:coupon:take", this.coupon);
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
  .dialog {
    background: rgb(246, 97, 86);
    text-align: center;
    padding: 30px 10px;
    border-radius: 6px;

    .title {
      font-size: 24px;
      line-height: 1;
      font-weight: 600;
      color: #fff;
      margin: 0px auto 30px;
    }

    .remark {
      color: #fff;
      font-size: 13px;
      font-weight: 400;
      line-height: 1.5;
      margin-top: 20px;
    }

    .action {
      border-radius: 10px;
      border: none;
      width: 80%;
      background: rgb(249, 209, 151);

      font-weight: 500;
      font-size: 15px;
      line-height: 2;
    }
  }
}
</style>
