<template>
  <bill-button icon="phone" :label="managerName" @click.native="call" />
</template>

<script lang="ts">
import { Component, Vue, Watch, Mixins } from "vue-property-decorator";

import SyncMixin from "@/mixin/SyncMixin";
import BillButton from "./BillButton.vue";

@Component({
  components: {
    BillButton,
  },
})
export default class Home extends Mixins(SyncMixin) {
  merchantId: number = null;
  openid: string = null;

  get managerName() {
    return this.$options.filters.mask(
      this.$options.filters.safe(this.manager, "realname"),
      1,
      "老师"
    );
  }

  get manager() {
    return this.entity;
  }

  created() {
    this.loadManager();
  }

  @Watch("route", { deep: true })
  onRouteChanged() {
    this.loadManager();
  }

  loadManager() {
    this.merchantId = parseInt(this.$route.params.merchantId as string);
    this.openid = this.$route.params.openid;

    this.store = "person";
    this.id = "manager";
    this.loadEntity({
      query: {
        merchant_id: this.merchantId,
        openid: this.openid,
      },
    });
  }

  call() {
    window.location.href = `tel:${this.manager.phone}`;
  }
}
</script>
<style lang="scss" scoped></style>
