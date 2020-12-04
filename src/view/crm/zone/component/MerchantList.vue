<template>
  <ai-section class="wrapper merchant-list">
    <ai-list-stored
      resource="mongoMerchant"
      :query="query"
      :limit="100"
      :refresh.sync="refresh"
      class="list"
    >
      <template v-slot:item="{ item }">
        <merchant :merchant="item" @click.native.stop="onSelected(item)" />
      </template>
    </ai-list-stored>
  </ai-section>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop, Mixins } from "vue-property-decorator";

import AiSection from "@/view/component/AiSection.vue";
import AiListStored from "@/view/component/AiListStored.vue";

import Merchant from "./Merchant.vue";

import merge from "lodash/merge";

@Component({
  components: {
    AiSection,
    AiListStored,
    Merchant,
  },
})
export default class Home extends Vue {
  refresh: boolean = false;
  keyword: string = null;
  curZone: any = null;
  center: any = null;

  get query() {
    let q: any = {};
    if (this.keyword) {
      q.title = { $regex: `${this.keyword}` };
    }
    if (this.curZone) {
      q.loc = {
        $geoWithin: {
          $polygon: this.curZone.location.coordinates[0],
        },
      };
    } else if (this.center) {
      q.loc = {
        $near: [this.center.lng, this.center.lat],
        $maxDistance: 3 / 111.12,
      };
    }
    return {
      query: JSON.stringify(q),
    };
  }

  created() {
    this.$bus.$on("map:center", (v) => {
      this.center = v;
    });

    this.$bus.$on("map:search:changed", (v) => {
      this.keyword = v;
    });

    this.$bus.$on("map:zone:selected", (v) => {
      this.curZone = v;
    });
  }

  onSelected(merchant) {
    this.$router.push({
      name: "crmMerchantEditing",
      params: {
        merchantId: merchant.id,
      },
    });
  }
}
</script>
<style lang="scss" scoped>
.merchant-list {
  margin: 10px 20px;

  & ::v-deep .ai-infinite-scroll__list {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }
}
</style>
