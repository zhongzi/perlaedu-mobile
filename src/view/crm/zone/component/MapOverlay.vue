<template>
  <div class="wrapper map-overlay">
    <ai-search v-model="keywords" />
    <div class="container">
      <div class="actions">
        <div class="action my-location">
          <i class="iconfont icon-location-current" />
        </div>
        <div class="action add-merchant">
          <i class="iconfont icon-plus" />
        </div>
      </div>
      <div class="entry-line">
        <hr />
      </div>
      <div class="merchants">
        <zone-list />
        <merchant-list />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

import AiSearch from "@/view/component/AiSearch.vue";
import ZoneList from "./ZoneList.vue";
import MerchantList from "./MerchantList.vue";

@Component({
  components: {
    AiSearch,
    ZoneList,
    MerchantList,
  },
})
export default class Home extends Vue {}
</script>
<style lang="scss" scoped></style>
