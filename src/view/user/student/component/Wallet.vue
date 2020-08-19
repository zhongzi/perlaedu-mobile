<template>
  <div class="section wallet">
    <img :src="require('@/asset/image/wallet-bg' + $densityStr + '.png')" />
    <div class="entries">
      <div class="entry" @click="openCouponList">
        <div class="number">
          <span> {{ user.count_coupon || 0 }} </span>张
        </div>
        <div class="title">课时券</div>
      </div>
      <div class="entry">
        <div class="number">
          <span> {{ user.score || 0 }} </span>
        </div>
        <div class="title">积分</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class Home extends Vue {
  get user() {
    return this.$auth.user;
  }

  openCouponList() {
    this.$router.push({
      name: "billProfileHome",
    });
  }
}
</script>
<style lang="scss" scoped>
.wallet {
  position: relative;
  img {
    width: 100%;
  }

  .entries {
    position: absolute;
    top: 30px;
    left: 40px;
    right: 120px;
    bottom: 0px;

    display: flex;
    align-items: center;
    justify-content: space-between;

    .entry {
      .number {
        font-size: 12px;
        font-weight: 600;
        color: rgba(255, 255, 255, 1);
        line-height: 17px;

        span {
          font-size: 40px;
        }
      }

      .title {
        font-size: 14px;
        font-weight: 600;
        color: rgba(255, 255, 255, 1);
        line-height: 20px;
        margin-top: 10px;
      }
    }
  }
}
</style>
