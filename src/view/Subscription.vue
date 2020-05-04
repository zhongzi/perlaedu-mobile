<template>
  <div class="wrapper">
    <div class="decorator" />
    <div class="container">
      <div class="header">
        <div class="title">下一步， 领取凭证</div>
        <div class="sub-title">非常重要: 凭证用于保障您的相关权益</div>
      </div>
      <div class="qrcode">
        <img :src="qrcode" />
        <span> 请长按二维码关注公众号进行领取</span>
      </div>
      <button class="btn" @click="goBack">已成功领取凭证</button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class Home extends Vue {
  created() {
    console.log(this.$route.query);
  }
  get qrcode() {
    return this.$route.query.qrcode;
  }
  get remark() {
    return this.$route.query.remark;
  }
  goBack() {
    window.location.href = this.$route.query.next as string;
  }
}
</script>
<style lang="scss" scoped>
.wrapper {
  position: relative;
  text-align: center;
  min-height: 100vh;
  overflow: hidden;

  background: linear-gradient(
    123deg,
    rgba(255, 207, 51, 1) 0%,
    rgba(255, 131, 6, 1) 100%
  );

  .decorator {
    position: absolute;
    top: 40px;
    right: -50px;

    width: 136px;
    height: 180px;
    transform: rotate(35deg);

    background: linear-gradient(
      234deg,
      rgba(255, 160, 47, 1) 0%,
      rgba(255, 189, 38, 1) 100%
    );
    border-radius: 24px;
  }

  .container {
    position: absolute;
    top: 0px;
    bottom: 0px;
    left: 0px;
    right: 0px;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    text-align: center;

    .header {
      .title {
        height: 45px;
        font-size: 32px;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: rgba(255, 255, 255, 1);
        line-height: 45px;
        letter-spacing: 1px;
        text-shadow: 0px 6px 6px rgba(255, 131, 6, 1);
      }
      .sub-title {
        height: 20px;
        font-size: 14px;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: rgba(255, 255, 255, 1);
        line-height: 20px;
        text-shadow: 0px 6px 6px rgba(255, 131, 6, 0.3);
      }
    }
    .qrcode {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 270px;
      height: 290px;
      background: #fff;
      border-radius: 20px;

      margin-top: 50px;
      margin-bottom: 30px;

      img {
        width: 250px;
      }
    }
    .btn {
      width: 206px;
      height: 42px;
      background: rgba(255, 255, 255, 0.8);
      box-shadow: 0px 14px 10px -8px rgba(255, 104, 6, 0.45);
      border-radius: 26px;

      color: rgb(242, 122, 21);
      text-shadow: 0 0 5px rgba(255, 120, 11, 0.5);
      font-size: 14px;
      font-weight: 600;

      border: none;

      &:focus {
        outline: 0;
      }
    }
  }
}
</style>
