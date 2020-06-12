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
    this.share();
    this.$bus.$on("website:merchant:refresh", this.loadMerchant);
  }

  @Watch("merchant", { deep: true })
  onMerchantChanged() {
    this.updateTitle();
    this.share();
  }

  @Watch("$route", { deep: true })
  onRouteChanged() {
    this.updateTitle();
  }

  loadMerchant() {
    this.id = this.$route.params.merchantId;
    this.loadEntity({
      query: {
        extras: "location,website,me,count_persons,scene_qrcode_url",
      },
    });
  }

  updateTitle() {
    const name = (this.merchant.name || "") + " - 移动微官网";
    this.$store.commit("updateTitle", name);
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
