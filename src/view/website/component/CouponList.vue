<template>
  <div class="wrapper coupon">
    <ai-list-stored
      resource="billItem"
      :query="innerQuery"
      scrollType="none"
      :hideIfNoData="true"
    >
      <template v-slot:item="{ item }">
        <coupon :coupon="item" :key="item.id" />
      </template>
    </ai-list-stored>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

import SyncMixin from "@/mixin/SyncMixin";

import AiListStored from "@/view/component/AiListStored.vue";
import Coupon from "./Coupon.vue";

import merge from "lodash/merge";

@Component({
  components: {
    AiListStored,
    Coupon,
  },
})
export default class Home extends Vue {
  @Prop({ type: Object, default: null }) query: any;

  get innerQuery() {
    return merge(
      {
        union_id: 0,
        project_id: 0,
        merchant_id: 0,
        is_welfare: true,
        extras: "links",
      },
      this.query || {}
    );
  }
}
</script>

<style lang="scss" scoped>
.union {
  padding: 0px 27px;
}
</style>
