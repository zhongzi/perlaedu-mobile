<template>
  <div class="wrapper">
    <ai-list-stored
      resource="unionMerchant"
      :query="innerQuery"
      scrollType="none"
      :enableEmpty="false"
    >
      <template v-slot:item="{ item }">
        <union-merchant :union-merchant="item" />
      </template>
    </ai-list-stored>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

import SyncMixin from "@/mixin/SyncMixin";

import AiListStored from "@/view/component/AiListStored.vue";
import UnionMerchant from "./UnionMerchant.vue";

import merge from "lodash/merge";

@Component({
  components: {
    AiListStored,
    UnionMerchant,
  },
})
export default class Home extends Vue {
  @Prop({ type: Object, default: null }) query: any;

  get innerQuery() {
    return merge(
      {
        merchant_id: this.$route.params.merchantId,
        extras: JSON.stringify({
          Union: ["count_merchants"],
          UnionMerchant: [
            "union",
            "contributions_pure",
            "contributions_pure_rank",
          ],
        }),
      },
      this.query || {}
    );
  }
}
</script>
