<template>
  <div class="wrapper">
    <router-view />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Mixins, Watch } from "vue-property-decorator";

import SyncMixin from "@/mixin/SyncMixin";

import isEmpty from "lodash/isEmpty";

@Component
export default class Home extends Mixins(SyncMixin) {
  get merchant() {
    return this.entity;
  }

  created() {
    this.store = "merchant";
    this.loadMerchant();
  }

  @Watch("merchant", { deep: true })
  onMerchantChanged() {
    this.share();
  }

  @Watch("$route", { deep: true })
  onRouteChanged() {
    this.loadMerchant();
  }

  loadMerchant() {
    this.id = this.$route.params.merchantId;
    this.loadEntity({
      requireColumns: ["count_persons"],
      query: {
        extras: JSON.stringify({
          Merchant: [
            "count_persons",
            "me",
            "location",
            "scene_qrcode_url",
            "union_merchant",
            "website",
            "coupon",
          ],
          Website: ["skin"],
        }),
      },
    });
  }

  share() {
    if (isEmpty(this.merchant)) return;

    const name = this.merchant.name + " - 机构门户";
    this.$bus.$emit("config:share", {
      title: name,
      desc: "马上点击进入获取更多优惠与精彩信息",
      imgUrl: this.merchant.cover_url || this.merchant.logo_url,
    });
  }
}
</script>
