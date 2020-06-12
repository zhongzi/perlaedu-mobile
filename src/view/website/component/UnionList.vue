<template>
  <div class="wrapper union">
    <ai-list-stored
      resource="unionMerchant"
      :query="innerQuery"
      scrollType="none"
      :hideIfNoData="true"
    >
      <template v-slot:item="{ item }">
        <union :union="item.union" :merchant="item.merchant" class="item" />
      </template>
    </ai-list-stored>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

import SyncMixin from "@/mixin/SyncMixin";

import AiListStored from "@/view/component/AiListStored.vue";
import Union from "./Union.vue";

import merge from "lodash/merge";

@Component({
  components: {
    AiListStored,
    Union,
  },
})
export default class Home extends Vue {
  @Prop({ type: Object, default: null }) query: any;

  get innerQuery() {
    return merge(
      {
        extras: JSON.stringify({
          Union: ["count_merchants"],
          UnionMerchant: ["union"],
        }),
      },
      this.query || {}
    );
  }
}
</script>
<style lang="scss" scoped>
.union {
  padding: 0px 27px;
  .item {
    margin: 10px 0px;
  }
}
</style>
