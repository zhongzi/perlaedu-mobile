<template>
  <div class="wrapper coupon">
    <ai-list-stored
      resource="billItem"
      :query="innerQuery"
      scrollType="none"
      :hideIfNoData="true"
    >
      <template v-slot:item="{ item }">
        <coupon
          :coupon="item"
          :key="item.id"
          :merchant="merchant"
          :unionMerchant="unionMerchant"
        />
      </template>
    </ai-list-stored>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";

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
export default class Home extends Vue {
  @Prop({ type: Object, default: null }) merchant: any;
  @Prop({ type: Object, default: null }) query: any;

  unionMerchant: any = null;
  unionMerchants: any = null;

  get innerQuery() {
    return merge(
      {
        id: this.$configs.universalBillItem,
      },
      {}
    );
  }
  created() {
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
