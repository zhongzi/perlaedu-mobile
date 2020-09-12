<template>
  <div class="wrapper share" @click="open">
    <img :src="require('@/asset/image/coupon-entry' + $densityStr + '.png')" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class Home extends Vue {
  open() {
    this.$router.push({
      name: "billProfileCoupons",
    });
  }
}
</script>
<style lang="scss" scoped>
.share {
  img {
    width: 100%;
  }
}
</style>
