<template>
  <div class="wrapper settings">
    <ai-panel>
      <template v-slot:header> 门户高级设置 </template>
      <div>
        <campaigns-entry
          class="resource campaign"
          v-if="!sectionCampaign || sectionCampaign.enabled"
          :key="sectionCampaign && sectionCampaign.sid"
          :title="sectionCampaign && sectionCampaign.title"
        />
        <skin class="resource skin" :merchant="merchant" />
        <sections class="resource section" :merchant="merchant" />
        <union-merchant-list
          class="resource union-merchant"
          :query="query"
          :merchant="merchant"
        />
        <universe-coupon class="resource coupon" :merchant="merchant" />
        <share class="resource share" :merchant="merchant" />
      </div>
    </ai-panel>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";

import AiPanel from "@/view/component/AiPanel.vue";

import CampaignsEntry from "./CampaignsEntry.vue";
import Skin from "./Skin.vue";
import Sections from "./Sections.vue";
import UnionMerchantList from "./UnionMerchantList.vue";
import UniverseCoupon from "./UniverseCoupon.vue";
import Share from "./Share.vue";

import _get from "lodash/get";
import merge from "lodash/merge";
import cloneDeep from "lodash/cloneDeep";
import filter from "lodash/filter";

@Component({
  components: {
    AiPanel,
    CampaignsEntry,
    Skin,
    Sections,
    UnionMerchantList,
    UniverseCoupon,
    Share,
  },
})
export default class Home extends Vue {
  @Prop({ type: Object, default: null }) merchant: any;

  get query() {
    return {
      merchant_id: this.merchant.id,
    };
  }
  get sections() {
    return _get(this.merchant, "website.settings.sections");
  }

  get sectionCampaign() {
    return filter(this.sections, { sid: "campaign" })[0];
  }
}
</script>
<style lang="scss" scoped>
.settings {
  margin: 0px 20px;
  & ::v-deep .ai-panel__header {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    font-size: 16px;
  }
}
</style>
