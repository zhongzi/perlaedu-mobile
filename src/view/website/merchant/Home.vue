<template>
  <router-view />
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
        extras:
          "location,website,me,count_persons,scene_qrcode_url,union_merchant",
      },
    });
  }

  share() {
    if (isEmpty(this.merchant)) return;

    const name = this.merchant.name + " - 移动微官网";
    this.$bus.$emit("config:share", {
      title: name,
      desc: "马上点击进入获取更多优惠与精彩信息",
      imgUrl: this.merchant.cover_url || this.merchant.logo_url,
    });
  }
}
</script>
