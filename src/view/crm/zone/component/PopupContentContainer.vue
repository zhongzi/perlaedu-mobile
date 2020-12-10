<template>
  <div class="wrapper content">
    <div class="header">
      <i class="iconfont icon-location-c" @click.stop="resetCurrentLocation" />
      <div v-if="isEditing" class="editing" @click.stop="showEditingDialog">
        <i class="iconfont icon-editing" />
        <span>结束编辑</span>
      </div>
      <i class="iconfont icon-plus" @click.stop="addNewMerchant" />
    </div>
    <div class="body">
      <search-bar />
      <zone-list />
      <merchant-list class="merchant-list" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

import AiInput from "@/view/component/AiInput.vue";

import ZoneList from "./ZoneList.vue";
import MerchantList from "./MerchantList.vue";
import SearchBar from "./SearchBar.vue";

import isEmpty from "lodash/isEmpty";

@Component({
  components: {
    AiInput,
    ZoneList,
    MerchantList,
    SearchBar,
  },
})
export default class Home extends Vue {
  isEditing: boolean = false;

  created() {
    this.$bus.$on("map:mode:editing", (v) => {
      this.isEditing = v;
    });
  }

  showEditingDialog() {
    this.$bus.$emit("map:zone:editing:show");
  }

  resetCurrentLocation() {
    this.$bus.$emit("map:location:current:fetching");
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

  display: flex;
  flex-direction: column;

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px;
    flex-shrink: 0;

    i {
      background: #fff;
      padding: 10px;
      font-size: 20px;
    }
    i:first-child {
      font-weight: 700;
    }

    .editing {
      background: #fff;
      padding: 5px 8px 8px 5px;
      color: #ff4500;
      border-radius: 10px;
      font-size: 14px;

      i {
        font-size: 14px;
      }
    }
  }
  .body {
    flex: 1;
    background: #fff;
    border-radius: 20px 20px 0px 0px;

    .merchant-list {
      max-height: 40vh;
    }
  }
}
</style>
