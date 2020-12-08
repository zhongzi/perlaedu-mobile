<template>
  <div class="wrapper content">
    <div class="header">
      <i class="iconfont icon-location-c" @click.stop="resetCurrentLocation" />
      <div v-if="isEditing" class="editing" @click.stop="showEditingDialog">
        <i class="iconfont icon-editing" />
        <span>编辑区域</span>
      </div>
      <i class="iconfont icon-plus" @click.stop="addNewMerchant" />
    </div>
    <div class="body">
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

import isEmpty from "lodash/isEmpty";

@Component({
  components: {
    AiInput,
    ZoneList,
    MerchantList,
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
    margin: 10px;

    i {
      background: #fff;
      padding: 5px;
    }
    i:first-child {
      font-weight: 700;
      font-size: 18px;
    }

    .editing {
      background: #fff;
      padding: 5px 8px 8px 5px;
      color: #ff4500;
      border-radius: 10px;

      i {
        font-size: 20px;
      }
    }
  }
  .body {
    flex: 1;
    background: #f2f2f2;
    border-radius: 20px 20px 0px 0px;

    .merchant-list {
      max-height: 40vh;
    }
  }
}
</style>
