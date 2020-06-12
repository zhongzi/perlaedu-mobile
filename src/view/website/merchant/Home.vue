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
    this.id = this.$route.params.merchantId;
    this.loadEntity({
      query: {
        extras: "location,website",
      },
    });
    this.share();
  }

  @Watch("merchant", { deep: true })
  onMerchantChanged() {
    this.share();
  }

  share() {
    if (isEmpty(this.merchant)) return;

    this.$bus.$emit("config:share", {
      title: this.merchant.name + " - 专属移动微官网",
      desc: "马上点击进入获取更多优惠与精彩信息",
      imgUrl: this.merchant.cover_url || this.merchant.logo_url,
    });
  }
}
</script>
