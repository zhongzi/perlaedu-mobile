<template>
  <div class="wrapper numbers">
    <ai-number :num="countIssued" label="已送出" />
    <ai-number :num="countUsed" label="已核销" />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Mixins, Prop } from "vue-property-decorator";

import SyncMixin from "@/mixin/SyncMixin";

import AiNumber from "@/view/component/AiNumber.vue";

@Component({
  components: {
    AiNumber,
  },
})
export default class Home extends Mixins(SyncMixin) {
  @Prop({ type: Object, default: null }) merchant: any;

  countIssued: number = 0;
  countUsed: number = 0;

  get query() {
    return {
      limit: 1,
      counts: JSON.stringify({
        issued: {
          merchant_id: this.merchant.id,
          action: "issued",
          "Coupon.item_id": this.$configs.universalBillItem,
        },
        used: {
          merchant_id: this.merchant.id,
          action: "used",
          "Coupon.item_id": this.$configs.universalBillItem,
        },
      }),
    };
  }

  created() {
    this.store = "billCouponAction";
    this.load();
  }

  @Watch("query", { deep: true })
  onQueryChanged() {
    this.load();
  }

  load() {
    this.loadList({
      query: this.query,
      success: (resp) => {
        this.countIssued = resp.data.counts.issued;
        this.countUsed = resp.data.counts.used;
      },
      failreu: (err) => {
        this.$hui.toast.error(err.response.data.msg);
      },
    });
  }
}
</script>
<style lang="scss" scoped>
.numbers {
  display: flex;
  align-items: center;
  justify-content: space-around;

  margin-bottom: 10px;
}
</style>
