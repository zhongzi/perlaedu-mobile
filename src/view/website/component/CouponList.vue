<template>
  <div class="wrapper coupon">
    <coupon
      v-if="coupon.id"
      :coupon="coupon"
      :key="coupon.id"
      :merchant="merchant"
      :unionMerchant="unionMerchant"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch, Mixins } from "vue-property-decorator";

import SyncMixin from "@/mixin/SyncMixin";

import AiListStored from "@/view/component/AiListStored.vue";
import Coupon from "./Coupon.vue";

import merge from "lodash/merge";
import find from "lodash/find";

@Component({
  components: {
    AiListStored,
    Coupon,
  },
})
export default class Home extends Mixins(SyncMixin) {
  @Prop({ type: Object, default: null }) merchant: any;
  @Prop({ type: Object, default: null }) query: any;

  unionMerchant: any = null;
  unionMerchants: any = null;

  get coupon() {
    return this.entity;
  }

  created() {
    this.store = "billItem";
    this.id = this.$configs.gBillCouponId;
    this.loadEntity();

    // TODO
    this.$bus.$on("unionMerchant", (data) => {
      this.unionMerchants = data.list;
    });
  }

  @Watch("merchant", { deep: true })
  onMerchantChanged() {
    this.reset();
  }

  @Watch("unionMerchants", { deep: true })
  onUnionMerchantsChanged() {
    this.reset();
  }

  reset() {
    this.unionMerchant = find(this.unionMerchants, {
      merchant_id: this.merchant.id,
    });
    console.log(this.unionMerchant);
  }
}
</script>

<style lang="scss" scoped>
.union {
  padding: 0px 27px;
}
</style>
