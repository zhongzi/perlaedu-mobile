<template>
  <bill-button
    icon="phone"
    :label="staff | safe('realname') | mask(1, '老师')"
    @click.native="call"
  />
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

  get staff() {
    return this.entity;
  }

  created() {
    this.loadStaff();
  }

  @Watch("route", { deep: true })
  onRouteChanged() {
    this.loadStaff();
  }

  loadStaff() {
    this.merchantId = parseInt(this.$route.params.merchantId as string);
    this.openid = this.$route.params.openid;

    this.store = "person";
    this.id = "staff";
    this.loadEntity({
      query: {
        merchant_id: this.merchantId,
        openid: this.openid,
        extras: "phone",
      },
    });
  }

  call() {
    window.location.href = `tel:${this.staff.phone}`;
  }
}
</script>
<style lang="scss" scoped></style>
