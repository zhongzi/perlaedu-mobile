<template>
  <div class="wrapper union">
    <union
      v-if="unionMerchant.id"
      :union="unionMerchant.union"
      :merchant="unionMerchant.merchant"
      class="item"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch, Mixins } from "vue-property-decorator";

import SyncMixin from "@/mixin/SyncMixin";

import AiListStored from "@/view/component/AiListStored.vue";
import Union from "./Union.vue";

import merge from "lodash/merge";
import _get from "lodash/get";

@Component({
  components: {
    AiListStored,
    Union,
  },
})
export default class Home extends Mixins(SyncMixin) {
  @Prop({ type: Object, default: null }) merchant: any;

  get unionMerchant() {
    return this.entity;
  }

  created() {
    this.store = "unionMerchant";
    this.load();
  }

  @Watch("merchant", { deep: true })
  onMerchantChanged() {
    this.load();
  }

  load() {
    this.id = _get(this.merchant, "union_merchant.id", 0);
    this.loadEntity({
      id: this.id,
      query: {
        extras: JSON.stringify({
          Union: ["count_merchants"],
          UnionMerchant: ["union", "merchant"],
        }),
      },
    });
  }
}
</script>
<style lang="scss" scoped>
.union {
  .item {
    margin: 10px 0px;
  }
}
</style>
