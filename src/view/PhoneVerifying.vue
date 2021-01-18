<template>
  <div class="wrapper phone-verifying">
    <ly-detail>
      <template v-slot:header>
        <img :src="merchantLogo" class="logo" />
        <div class="name">{{ merchantName }}</div>
      </template>
      <template>
        <div class="body">
          <div class="info">
            <div class="title">{{ title }}</div>
            <div class="remark">{{ remark }}</div>
          </div>
          <ai-line />
          <div class="container">
            <template v-if="isAuthorizated">
              <div class="linked-info">
                <div class="title">
                  已经完成
                  <strong> {{ merchantName }} </strong> 的手机号码绑定授权
                </div>
                <div class="container items">
                  <div class="item">
                    <i class="iconfont icon-wechat wechat" />
                    <span> {{ $auth.user.nickname }} </span>
                  </div>
                  <div class="item">
                    <i class="iconfont icon-link link" />
                  </div>
                  <div class="item">
                    <i class="iconfont icon-shouji shouji" />
                    <span> {{ $auth.user.phone }} </span>
                  </div>
                </div>
              </div>
            </template>
            <template v-else-if="isUnauthorizated">
              <div class="message">
                <span> {{ verifiedPhone }} </span>
                <p>直接使用 {{ verifiedPhone }} 完成绑定?</p>
              </div>
            </template>
            <template v-else-if="isVerifiedPhone">
              <div class="linked-info">
                <div class="title">您已经完成手机号码绑定</div>
                <div class="container items">
                  <div class="item">
                    <i class="iconfont icon-wechat wechat" />
                    <span> {{ $auth.user.nickname }} </span>
                  </div>
                  <div class="item">
                    <i class="iconfont icon-link link" />
                  </div>
                  <div class="item">
                    <i class="iconfont icon-shouji shouji" />
                    <span> {{ $auth.user.phone }} </span>
                  </div>
                </div>
              </div>
            </template>
            <template v-else>
              <div class="input-group phone">
                <ai-input
                  v-model="phone"
                  mode="border-bottom"
                  label="手机号"
                  class="input"
                  placeholder="请输入手机号"
                />
                <ai-button-round @click.native="showCaptcha" class="btn">{{
                  captchatTitle
                }}</ai-button-round>
              </div>
              <div class="input-group">
                <ai-input
                  v-model="vcode"
                  mode="border-bottom"
                  label="短信验证码"
                  placeholder="请输入收到的短信验证码"
                />
              </div>
            </template>
          </div>
          <ai-submit-actions
            :cancelLabel="cancelLabel"
            :submitLabel="submitLabel"
            @cancel="onCancel"
            @submit="onSubmit"
          />
        </div>
      </template>
    </ly-detail>
    <ai-dialog
      v-model="open"
      :enableCloseIcon="true"
      class="dialog"
      :hideOnBlur="false"
    >
      <div id="nc-phone-verifying" />
    </ai-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Mixins, Watch } from "vue-property-decorator";

import SyncMixin from "@/mixin/SyncMixin";

import AiLine from "@/view/component/AiLine.vue";
import AiInput from "@/view/component/AiInput.vue";
import AiButtonRound from "@/view/component/AiButtonRound.vue";
import AiSubmitActions from "@/view/component/AiSubmitActions.vue";
import AiDialog from "@/view/component/AiDialog.vue";

import LyDetail from "@/view/layout/Detail.vue";

import _get from "lodash/get";
import isEmpty from "lodash/isEmpty";

@Component({
  components: {
    AiLine,
    AiInput,
    AiButtonRound,
    AiSubmitActions,
    AiDialog,
    LyDetail,
  },
})
export default class Home extends Mixins(SyncMixin) {
  open: boolean = false;
  phone: string = "";
  vcode: string = "";

  verifiedPhone: any = null;
  merchant: any = null;
  authorization: any = null;

  isSending: boolean = false;
  seconds: number = 60;
  inter: any = null;

  captchatTitle: string = "获取验证码";
  resetPhone: boolean = false;

  get isAuthorizated() {
    return this.authorization && !this.resetPhone;
  }

  get isUnauthorizated() {
    return (
      this.isVerifiedPhone &&
      !this.isAuthorizated &&
      this.merchantId > 0 &&
      !this.resetPhone
    );
  }

  get isVerifiedPhone() {
    return _get(this.$auth, "user.phone_verified") && !this.resetPhone;
  }

  get cancelLabel() {
    if (this.resetPhone) {
      return "返回";
    }
    if (this.isVerifiedPhone) {
      return "更换手机号码";
    }
    return "";
  }

  get submitLabel() {
    if (this.isAuthorizated) return "";
    if (this.isUnauthorizated) return "确认绑定";
    if (this.isVerifiedPhone) return "";
    return "确认绑定";
  }

  get merchantId() {
    return parseInt((this.$route.query.merchantId as string) || "0") || 0;
  }

  get merchantLogo() {
    if (!isEmpty(this.$route.query.logo)) {
      return this.$route.query.logo;
    }
    if (this.merchant) {
      return this.merchant.logo_url;
    }
    return require("@/asset/logo.bg.png");
  }

  get merchantName() {
    if (!isEmpty(this.$route.query.name)) {
      return this.$route.query.name;
    }
    if (this.merchant) {
      return this.merchant.name;
    }
    return "Ai教务";
  }

  get title() {
    return this.$route.query.title || "手机号码绑定";
  }

  get remark() {
    if (!isEmpty(this.$route.query.remark)) {
      return this.$route.query.remark;
    }
    if (this.merchant) {
      return `匹配当前微信在 ${this.merchant.name} 的相关数据， 以及方便之后接收相应的课时变动通知、课后 点评、学校重要通知等信息`;
    }
    return "完成手机号码绑定, 接收相应的课时变动通知、课后 点评、学校重要通知等信息";
  }

  created() {
    this.verifiedPhone = _get(this.$auth, "user.phone");

    this.loadMerchant();
    this.loadAuthorization();
    this.initCaptchaAliyun();
  }

  @Watch("merchantId")
  onMerchantIdChanged() {
    this.loadMerchant();
    this.loadAuthorization();
  }

  @Watch("isVerifiedPhone")
  onIsVerifiedPhoneChanged() {
    this.initCaptchaAliyun();
  }

  initCaptchaAliyun() {
    if (this.isVerifiedPhone) return;

    const reset = () => {
      window.NoCaptcha.setEnabled(true);
      window.nc.reset();
      window.NoCaptcha.upLang("cn", {
        LOADING: "加载中...",
        SLIDER_LABEL: "滑动获取短信验证码",
        CHECK_Y: "验证通过, 注意查收短信",
        ERROR_TITLE: "非常抱歉，这出错了...",
        CHECK_N: "验证未通过",
        OVERLAY_INFORM: "经检测你当前操作环境存在风险，请输入验证码",
        TIPS_TITLE: "验证码错误，请重新输入",
      });
    };
    if (window.nc) {
      reset();
    }

    const timestamp = new Date().getTime();
    const url =
      "https://g.alicdn.com/sd/nch5/index.js?t=" + timestamp / (3600 * 1000);
    const ncAppkey = this.$configs.captchaAliyunAppkey;
    const ncToken = [ncAppkey, timestamp, Math.random()].join(":");
    const ncScene = "nc_message_h5";
    this.$loadScript(url, () => {
      window.nc = window.NoCaptcha.init({
        renderTo: "#nc-phone-verifying",
        appkey: ncAppkey,
        scene: ncScene,
        token: ncToken,
        is_Opt: 0,
        language: "cn",
        timeout: 10000,
        retryTimes: 5,
        errorTimes: 5,
        inline: false,
        apimap: {},
        bannerHidden: false,
        initHidden: false,
        callback: (data) => {
          this.sendSms({
            method: "aliyun",
            appkey: ncAppkey,
            scene: ncScene,
            token: ncToken,
            sessionid: data.csessionid,
            sig: data.sig,
          });
        },
        error: (e) => {
          console.log(e);
        },
      });
      reset();
    });
  }

  loadMerchant() {
    if (this.merchantId <= 0) return;

    this.loadEntity({
      store: "merchant",
      id: this.merchantId,
      query: {
        extras: "logo_url",
      },
      success: (resp) => {
        this.merchant = resp.data;
      },
    });
  }

  loadAuthorization() {
    if (this.merchantId <= 0) return;

    this.loadList({
      store: "authorization",
      query: {
        merchant_id: this.merchantId,
        openid: this.$auth.user.openid,
      },
      success: (resp) => {
        this.authorization = !isEmpty(resp.data.data) && resp.data.data[0];
      },
    });
  }

  showCaptcha() {
    if (this.isSending) return;

    if (!this.$tools.regxs.telephone(this.phone)) {
      this.$hui.toast.error("请输入正确的手机号码");
      return;
    }

    this.open = true;
    this.$nextTick(() => {
      this.initCaptchaAliyun();
    });
  }

  sendSmsCanceled() {
    this.open = false;
  }

  sendSms(options) {
    if (this.isSending) return;

    if (!this.$tools.regxs.telephone(this.phone)) {
      this.$hui.toast.error("请输入正确验证码");
      return;
    }

    this.saveEntity({
      store: "sms",
      res: {
        phone: this.phone,
        options: options,
      },
      success: () => {
        this.open = false;
        this.isSending = true;
        this.startCountdown();
      },
      failure: (err) => {
        this.$hui.toast.error(err.response.data.message);
      },
    });
  }

  startCountdown() {
    if (!this.inter) {
      this.seconds = 60;
      this.inter = setInterval(() => {
        this.seconds -= 1;
        this.captchatTitle = `${this.seconds}s`;

        if (this.seconds <= 0) {
          clearInterval(this.inter);
          this.inter = null;
          this.isSending = false;
          this.captchatTitle = "重新获取验证码";
        }
      }, 1000);
    }
  }

  onCancel() {
    if (this.resetPhone) {
      this.resetPhone = false;
      return;
    }
    if (this.isVerifiedPhone) {
      this.resetPhone = true;
      return;
    }

    this.$router.go(-1);
  }

  onSubmit() {
    if (this.isVerifiedPhone) {
      this.saveAuthorization();
    } else {
      this.verify();
    }
  }

  saveAuthorization() {
    this.saveEntity({
      store: "authorization",
      res: {
        merchant_id: this.merchantId,
      },
      success: () => {
        this.$nextTick(() => {
          this.gotoNext();
        });
      },
    });
  }

  verify() {
    if (!this.$tools.regxs.telephone(this.phone)) {
      this.$hui.toast.error("请输入正确的手机号码");
      return;
    }

    if (isEmpty(this.vcode)) {
      this.$hui.toast.error("请输入短信验证码");
      return;
    }

    this.saveEntity({
      store: "sms",
      res: {
        phone: this.phone,
        vcode: this.vcode,
        merchant_id: this.merchantId,
      },
      success: () => {
        this.verifiedPhone = this.phone;
        this.$auth.user.phone = this.phone;
        this.$auth.user.phone_verified = true;

        this.$nextTick(() => {
          this.gotoNext();
        });
      },
      failure: (err) => {
        let msg = err.response.data.message;
        if (msg === "资源冲突") {
          msg = "手机号已被占用， 请输入其它手机号码";
        }
        this.$hui.toast.error(msg);
      },
    });
  }

  gotoNext() {
    if (!this.$router.pushNext({ current: this.$route })) {
      this.loadMerchant();
      this.loadAuthorization();
    }
  }
}
</script>
<style lang="scss" scoped>
.phone-verifying {
  width: 100%;
  height: 100%;
  .logo {
    width: 70px;
    height: 70px;
    border-radius: 50%;
    box-shadow: 0px 0px 30px #ea8d0a;
  }
  .name {
    font-size: 18px;
    font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
    font-weight: bold;
    color: #ffffff;
    line-height: 31px;
    letter-spacing: 2px;
  }
  .body {
    padding: 10px 20px;

    .container {
      padding: 10px 10px;
    }

    .linked-info {
      .title {
        font-size: 14px;
        text-align: center;
        line-height: 2;
      }
      .items {
        padding: 15px;
        display: flex;
        align-items: center;
        justify-content: space-around;

        .item {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          i {
            font-size: 32px;
            color: #52b334;
          }
          span {
            font-size: 12px;
          }
        }
      }
    }

    .message {
      min-height: 100px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      span {
        font-size: 24px;
        font-weight: 600;
        text-shadow: 2px 1px #000;
      }
      p {
        color: red;
      }
    }
    .info {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 10px;

      .title {
        font-size: 18px;
        font-weight: 600;
        color: #4a4a4a;
        line-height: 2;
      }
      .remark {
        font-size: 13px;
        color: #928e8e;
      }
    }
    .phone {
      display: flex;
      align-items: center;
      justify-content: space-between;

      .input {
        flex: 1;
      }

      .btn {
        width: 100px;
        min-height: 30px;
      }
    }
  }
}
.dialog {
  & ::v-deep .h-dialog__dialog {
    background: none;
    text-align: center;
    padding-bottom: 30px;
  }

  & ::v-deep .ai-dialog__close {
    i {
      color: rgba(255, 255, 255, 0.6);
    }
  }
}
</style>
