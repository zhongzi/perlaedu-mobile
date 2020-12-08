<template>
  <ai-section class="wrapper merchant-list">
    <ai-list-stored
      v-if="showList"
      class="list"
      resource="mongoMerchant"
      :query="query"
      :limit="100"
      :refresh.sync="refresh"
      @emit-list="merchantsLoadedInZone"
    >
      <template v-slot:item="{ item }">
        <merchant
          :merchant="item"
          @click.native.stop="onSelected(item)"
          :class="[curMerchant === item ? 'selected' : '']"
        />
      </template>
    </ai-list-stored>
  </ai-section>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop, Mixins } from "vue-property-decorator";

import SyncMixin from "@/mixin/SyncMixin";

import AiSection from "@/view/component/AiSection.vue";
import AiListStored from "@/view/component/AiListStored.vue";

import Merchant from "./Merchant.vue";

import isEmpty from "lodash/isEmpty";
import merge from "lodash/merge";

@Component({
  components: {
    AiSection,
    AiListStored,
    Merchant,
  },
})
export default class Home extends Mixins(SyncMixin) {
  refresh: boolean = false;

  city: string = null;
  keyword: string = null;
  curZone: any = null;
  curMerchant: any = null;

  get showList() {
    return this.curZone || !isEmpty(this.keyword);
  }

  get query() {
    let q: any = {};
    if (!isEmpty(this.city)) {
      q["ad_info.city"] = this.city;
    }

    if (this.keyword) {
      q.title = { $regex: `${this.keyword}` };
    }
    if (this.curZone) {
      q.loc = {
        $geoWithin: {
          $geometry: {
            type: "MultiPolygon",
            coordinates: [this.curZone.location.coordinates],
          },
        },
      };
    }
    return {
      query: JSON.stringify(q),
    };
  }

  created() {
    this.store = "mongoMerchant";

    this.$bus.$on("map:city:changed", (v) => {
      this.city = v;
    });

    this.$bus.$on("map:search:changed", (v) => {
      this.keyword = isEmpty(v) ? null : v;
    });

    this.$bus.$on("map:zone:selected", (v) => {
      this.curZone = v;
    });

    this.$bus.$on("map:bounds:changed", (v) => {
      this.merchantsLoadInBounds(v);
    });
  }

  @Watch("curMerchant")
  onCurZoneChanged() {
    this.$bus.$emit("map:marker:selected", this.curMerchant);
  }

  merchantsLoadedInZone(v) {
    this.$bus.$emit("map:markers:inSelectedZone", v);
  }

  merchantsLoadInBounds(bound) {
    const sw = bound.getSouthWest();
    const ne = bound.getNorthEast();
    let query = {
      loc: {
        $geoWithin: {
          $geometry: {
            type: "MultiPolygon",
            coordinates: [
              [
                [
                  [ne.lng, ne.lat],
                  [ne.lng, sw.lat],
                  [sw.lng, sw.lat],
                  [sw.lng, ne.lat],
                  [ne.lng, ne.lat],
                ],
              ],
            ],
          },
        },
      },
    };
    if (!isEmpty(this.city)) {
      query["ad_info.city"] = this.city;
    }
    this.loadList({
      reset: true,
      query: {
        query: JSON.stringify(query),
        limit: 1000,
      },
      success: (resp) => {
        this.$bus.$emit("map:markers:inView", {
          list: resp.data.data,
          total: resp.data.total,
        });
      },
    });
  }

  onSelected(item) {
    if (this.curMerchant === item) {
      this.curMerchant = null;
    } else {
      this.curMerchant = item;
    }
  }
}
</script>
<style lang="scss" scoped>
.merchant-list {
  margin: 10px 20px;

  .selected {
    border: 1px solid #f00;
  }

  & ::v-deep .ai-infinite-scroll__list {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }
}
</style>
