<template>
  <div class="wrapper content">
    <div class="header">
      <i class="iconfont icon-location-c" @click.stop="resetCurrentLocation" />
      <i class="iconfont icon-plus" @click.stop="addNewMerchant" />
    </div>
    <div class="body">
      <zone-list />
      <merchant-list />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

import AiInput from "@/view/component/AiInput.vue";

import ZoneList from "./ZoneList.vue";
import MerchantList from "./MerchantList.vue";

import isEmpty from "lodash/isEmpty";

@Component({
  components: {
    AiInput,
    ZoneList,
    MerchantList,
  },
})
export default class Home extends Vue {
  resetCurrentLocation() {
    this.$bus.$emit("map:location:current");
  }

  addNewMerchant() {
    this.$router.push({
      name: "crmMerchantEditing",
      params: {
        merchantId: "new",
      },
    });
  }
}
</script>
<style lang="scss" scoped>
.content {
  position: fixed;
  bottom: 0px;
  left: 0px;
  right: 0px;
  z-index: 9999;
  width: 100%;
  height: 50vh;

  display: flex;
  flex-direction: column;

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 10px 10px 0px 10px;

    i {
      background: #fff;
      padding: 5px;
    }
    i:first-child {
      font-weight: 700;
      font-size: 18px;
    }
  }
  .body {
    flex: 1;
    background: #f2f2f2;
    border-radius: 20px 20px 0px 0px;
  }
}
</style>
