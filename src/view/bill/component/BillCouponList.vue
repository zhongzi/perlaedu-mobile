<template>
  <ai-list-stored
    resource="billCoupon"
    :query="innerQuery"
    :scrollHeight="scrollHeight"
  >
    <template v-slot:item="{ item, tag }">
      <component
        :is="innerComp"
        :key="item.id"
        :coupon="item"
        :outerTag="tag"
        :showUser="showUser"
        :showActions="showActions"
        :couponClickedRoute="couponClickedRoute"
      />
    </template>
  </ai-list-stored>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

import AiListStored from "@/view/component/AiListStored.vue";

import BillCoupon from "./BillCoupon.vue";

@Component({
  components: {
    AiListStored,
  },
})
export default class Home extends Vue {
  @Prop({ type: Object, default: () => ({}) }) query: any;
  @Prop({ type: Function, default: null }) comp: any;
  @Prop({ type: Boolean, default: false }) showUser: boolean;
  @Prop({ type: Boolean, default: true }) showActions: boolean;
  @Prop({ type: String, default: "90vh" }) scrollHeight: string;
  @Prop({ type: String, default: "billProfileCouponDetail" })
  couponClickedRoute: string;

  get innerComp() {
    return this.comp || BillCoupon;
  }

  get innerQuery() {
    return Object.assign(
      {},
      this.query || {},
      JSON.parse((this.$route.query.query as any) || "{}")
    );
  }
}
</script>
