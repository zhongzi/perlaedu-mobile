<template>
  <ai-section class="wrapper zone-list">
    <ai-list-stored
      resource="mongoMerchantZone"
      :query="query"
      :limit="100"
      :refresh.sync="refresh"
      scrollType="slider"
      :sliderOptions="{ slidesPerView: 5, spaceBetween: 20 }"
      class="list"
    >
      <template v-slot:item="{ item }">
        <zone
          :zone="item"
          @click.native="onSelected(item)"
          :class="[curZone === item ? 'selected' : '']"
        />
      </template>
    </ai-list-stored>
  </ai-section>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop, Mixins } from "vue-property-decorator";

import AiSection from "@/view/component/AiSection.vue";
import AiListStored from "@/view/component/AiListStored.vue";

import Zone from "./Zone.vue";

import merge from "lodash/merge";
import _get from "lodash/get";

@Component({
  components: {
    AiSection,
    AiListStored,
    Zone,
  },
})
export default class Home extends Vue {
  refresh: boolean = false;
  curZone: any = null;

  get isAdmin() {
    return _get(this.$auth, "user.kind") === 1;
  }

  get query() {
    return this.isAdmin
      ? {}
      : {
          query: JSON.stringify({
            "follower.openid": this.$auth.openid,
          }),
        };
  }

  created() {
    this.$bus.$on("map:zone:refresh", () => {
      this.refresh = true;
    });
  }

  @Watch("curZone")
  onCurZoneChanged() {
    this.$bus.$emit("map:zone:selected", this.curZone);
  }

  onSelected(item) {
    if (this.curZone === item) {
      this.curZone = null;
    } else {
      this.curZone = item;
    }
  }
}
</script>
<style lang="scss" scoped>
.zone-list {
  margin: 0px 20px;

  .selected {
    border: 1px solid #f00;
  }
}
</style>
