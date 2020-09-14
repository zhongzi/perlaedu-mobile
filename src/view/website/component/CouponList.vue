<template>
  <div class="wrapper coupon">
    <coupon
      v-if="coupon.id"
      :coupon="coupon"
      :merchant="merchant"
      :style="skin"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch, Mixins } from "vue-property-decorator";

import SyncMixin from "@/mixin/SyncMixin";
import StopBodyScrollMixin from "@/mixin/StopBodyScrollMixin";

import AiInput from "@/view/component/AiInput.vue";
import AiListStored from "@/view/component/AiListStored.vue";
import Coupon from "./Coupon.vue";

import merge from "lodash/merge";
import find from "lodash/find";
import _get from "lodash/get";
import isEmpty from "lodash/isEmpty";

@Component({
  components: {
    AiInput,
    AiListStored,
    Coupon,
  },
})
export default class Home extends Mixins(SyncMixin) {
  @Prop({ type: Object, default: null }) merchant: any;

  get skin() {
    return _get(this.merchant, "website.skin.coupon", {});
  }

  get coupon() {
    return this.entity;
  }

  get couponId() {
    return parseInt(_get(this.merchant, "coupon.id"));
  }

  created() {
    this.store = "billItem";
    this.load();
    this.$bus.$on("bill:item:taked", () => {
      this.commitChanges(this.couponId, { is_takeable: false });
    });
  }

  @Watch("couponId")
  onCouponIdChanged() {
    this.load();
  }

  load() {
    if (!this.couponId) return;

    this.id = this.couponId;
    this.loadEntity({
      query: {
        extras: JSON.stringify({
          BillItem: ["is_takeable", "links", "is_taken"],
          BillItemLink: ["target"],
        }),
      },
    });
  }
}
</script>

<style lang="scss" scoped>
.coupon {
}
</style>
