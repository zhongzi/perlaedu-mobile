<template>
  <div class="wrapper coupon">
    <coupon v-if="coupon.id" :coupon="coupon" :merchant="merchant" />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch, Mixins } from "vue-property-decorator";

import SyncMixin from "@/mixin/SyncMixin";

import AiListStored from "@/view/component/AiListStored.vue";
import Coupon from "./Coupon.vue";

import merge from "lodash/merge";
import find from "lodash/find";
import _get from "lodash/get";

@Component({
  components: {
    AiListStored,
    Coupon,
  },
})
export default class Home extends Mixins(SyncMixin) {
  @Prop({ type: Object, default: null }) merchant: any;

  get coupon() {
    return this.entity;
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
  }

  @Watch("couponId")
  onCouponIdChanged() {
    this.load();
  }

  load() {
    this.id = this.couponId;
    this.loadEntity({
      query: {
        extras: "is_takeable",
      },
    });
  }
}
</script>

<style lang="scss" scoped>
.union {
}
</style>
