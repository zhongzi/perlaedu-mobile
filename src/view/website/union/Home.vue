<template>
  <router-view />
</template>

<script lang="ts">
import { Component, Vue, Mixins, Watch } from "vue-property-decorator";

import SyncMixin from "@/mixin/SyncMixin";

import isEmpty from "lodash/isEmpty";

@Component
export default class Home extends Mixins(SyncMixin) {
  get union() {
    return this.entity;
  }

  created() {
    this.store = "union";
    this.id = this.$route.params.unionId;
    this.loadEntity({
      query: {
        extras: "count_merchants,location,website",
      },
    });
    this.share();
  }

  @Watch("union", { deep: true })
  onMerchantChanged() {
    this.share();
  }

  share() {
    if (isEmpty(this.union)) return;

    this.$bus.$emit("config:share", {
      title: this.union.name + " - 线上综合体",
      desc: "马上点击进入获取更多优惠与精彩信息",
      imgUrl: this.union.cover_url || this.union.logo_url,
    });
  }
}
</script>
