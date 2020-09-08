<template>
  <div class="flash-trade-wrapper">
    <router-link to="$route.query.next">
      <img
        src="@/asset/image/paying-bg.png"
        srcset="
          @/asset/image/paying-bg.png    1x,
          @/asset/image/paying-bg@2x.png 2x,
          @/asset/image/paying-bg@3x.png 3x
        "
      />
    </router-link>
    <p>{{ errMsg }}</p>
    <div class="btn" @click="goFailure">关闭</div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Mixins } from "vue-property-decorator";
import SyncMixin from "@/mixin/SyncMixin";
import auth from "@/service/auth";

@Component
export default class Home extends Mixins(SyncMixin) {
  res: any = {
    type_: "",
    related_id: "",
  };
  errMsg: string = "";

  get successURL() {
    return this.$route.query.next as string;
  }

  get failureURL() {
    return (this.$route.query.failure as string) || this.successURL;
  }

  get cancelURL() {
    return (this.$route.query.cancel as string) || this.failureURL;
  }

  created() {
    // ios环境微信支付patch
    // 微信支付安全目录检测以最后一个/得到， 经过测试包含#
    // 比如：https://ai.perlaedu.com/pay/#/flask-trade?type=bill&related_id=1
    // 拿到的安全目录为: https://ai.perlaedu.com/lotteries/#/
    // 因此两种处理方式
    // 1，配置安全目录为上述
    // 2, 让第一次进入直接为:https://ai.perlaedu.com/pay/根目录
    //    又或者采用网上方案在进入之前在#号前面增加一个?以此达到相同安全目录

    if (!window.location.href.match(/\?#/)) {
      let url = window.location.href.replace("#", "?#");
      window.location.replace(url);
      return;
    }

    this.store = "payOrder";
    this.res.type_ = this.$route.query.type;
    this.res.related_id = this.$route.query.related_id;

    this.saveEntity({
      res: this.res,
      success: (resp) => {
        let payInfo = JSON.parse(resp.data) || {};
        Vue.delete(payInfo, "callback_url");
        Vue.delete(payInfo, "status");
        this.$weixin.config(() => {
          this.$weixin.tradePay({
            payInfo: payInfo,
            success: (res) => {
              this.goSuccess();
            },
            fail: (res) => {
              this.goFailure();
            },
            cancel: (res) => {
              this.goCancel();
            },
          });
        });
      },
      failure: (err) => {
        this.$hui.toast.error(err.response.data.message);
      },
    });
  }

  goSuccess() {
    this.goto(this.successURL);
  }

  goFailure() {
    this.goto(this.failureURL);
  }

  goCancel() {
    this.goto(this.cancelURL);
  }

  goto(url) {
    window.location.replace(url);
  }
}
</script>

<style lang="scss" scoped>
.flash-trade-wrapper {
  background: #f5f5f5;
  text-align: center;
  font-size: 18px;
  height: 85vh;

  img {
    margin-top: 117px;
    width: 295px;
    height: 293px;
  }

  .btn {
    margin: 100px auto 16px;
    width: 189px;
    height: 44px;
    background: #f0edf1;
    border-radius: 22px;
    font-size: 16px;
    font-weight: 600;
    color: #4a4a4a;
    line-height: 44px;
  }
}
</style>
