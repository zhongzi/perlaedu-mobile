<template>
  <div class="wrapper register">
    <div class="decorator">
      <div class="left"></div>
      <div class="right-top"></div>
      <div class="right"></div>
    </div>
    <div class="content">
      <div class="header">
        <img :src="require('@/asset/logo.bg.png')" class="cover" />
        <div class="title">Ai教务</div>
      </div>
      <div class="body">
        <div class="services">
          <div :class="['service', { 'service-actived': curSlogIdx === 0 }]">
            <div class="icon">
              <i class="iconfont icon-website" />
            </div>
            <span>学校门户</span>
          </div>
          <div :class="['service', { 'service-actived': curSlogIdx === 1 }]">
            <div class="icon">
              <i class="iconfont icon-management" />
            </div>
            <span>教务管理</span>
          </div>
          <div :class="['service', { 'service-actived': curSlogIdx === 2 }]">
            <div class="icon">
              <i class="iconfont icon-zhaosheng" />
            </div>
            <span>活动招生</span>
          </div>
        </div>
        <div class="coupon" :style="couponStyle">
          <div class="slogs">
            <template v-for="(slog, index) in slogs">
              <div
                :key="index"
                :class="[
                  'slog',
                  'animate__animated',
                  { animate__fadeInDown: index === curSlogIdx },
                  { animate__fadeOutDown: index !== curSlogIdx },
                ]"
              >
                {{ slog }}
              </div>
            </template>
          </div>
          <div class="influence">超<span> 2000 </span>家教培机构共同选择</div>
        </div>
        <div class="remark">
          金牌客服全程跟踪指导
        </div>
        <template v-if="!isSubmited">
          <ai-input
            placeholder="学校名称"
            v-model="merchant.name"
            class="input"
          />
          <ai-input
            placeholder="联系人"
            v-model="merchant.contact_name"
            class="input"
          />
          <ai-input
            placeholder="联系号码"
            v-model="merchant.phone"
            class="input"
          />
          <hui-button class="action" @click.native="save">
            马上开通
          </hui-button>
        </template>
        <template v-else>
          <div class="success">
            <i class="iconfont icon-checked" />
            <p>开通信息已经提交</p>
            <p>专属客服将第一时间和您取得联系</p>
            <p>请稍后...</p>
          </div>
        </template>
      </div>
    </div>
    <ai-copyright :manual="true" class="copyright" />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Mixins } from "vue-property-decorator";
import SyncMixin from "@/mixin/SyncMixin";

import AiCell from "@/view/component/AiCell.vue";
import AiCard from "@/view/component/AiCard.vue";
import AiDialog from "@/view/component/AiDialog.vue";
import AiInput from "@/view/component/AiInput.vue";
import AiLine from "@/view/component/AiLine.vue";
import AiCopyright from "@/view/component/AiCopyright.vue";

import isEmpty from "lodash/isEmpty";

@Component({
  components: {
    AiCell,
    AiCard,
    AiDialog,
    AiInput,
    AiLine,
    AiCopyright,
  },
})
export default class Home extends Mixins(SyncMixin) {
  merchant: any = {
    name: "",
    phone: "",
    contact_name: "",
  };

  isSubmited = false;
  intervalId = null;
  curSlogIdx = 0;
  slogs: any = [
    "一张精美的校区名片",
    "一个智慧的校区助理",
    "一款专属的招生利器",
  ];

  get couponStyle() {
    return {
      backgroundSize: "100% 100%",
      backgroundImage:
        "url(" +
        require("@/asset/image/coupon-bg" + this.$densityStr + ".png") +
        ")",
    };
  }

  created() {
    this.store = "crmClue";

    this.intervalId = setInterval(() => {
      if (this.curSlogIdx >= this.slogs.length - 1) {
        this.curSlogIdx = 0;
      } else {
        this.curSlogIdx += 1;
      }
    }, 4000);

    this.$bus.$emit("config:share", {
      title: "马上开通 - Ai教务",
      desc:
        "教培人的专属利器，学校门户/教务管理/招生活动三大问题一站式解决方案",
    });
  }

  beforeDestory() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  save() {
    if (
      isEmpty(this.merchant.phone) ||
      !this.$tools.regxs.telephone(this.merchant.phone)
    ) {
      this.$hui.toast.error("请输入正确的手机号码");
      return;
    }

    const clue: any = {
      code: this.$route.query.code || this.$configs.crmChannelCode,
      source_id: this.$route.query.source_id,
      source_class: this.$route.query.source_class,
      name: this.merchant.name,
      phone: this.merchant.phone,
      remark: "联系人: " + this.merchant.contact_name,
      openid: this.$store.state.expose,
      referrer_openid: this.$store.state.expose2,
      url: window.location.href,
    };

    this.saveEntity({
      res: clue,
      success: () => {
        this.isSubmited = true;
        this.$hui.toast.info("提交成功");
      },
      failure: () => {
        this.$hui.toast.error("抱歉，提交失败，请稍后再试");
      },
    });
  }
}
</script>
<style lang="scss" scoped>
.register {
  height: 100vh;
  background: linear-gradient(
    133deg,
    rgba(255, 109, 47, 1) 0%,
    rgba(255, 100, 82, 1) 100%
  );
  box-shadow: 0px 8px 14px 0px rgba(0, 0, 0, 0.06);
  padding: 40px 30px;

  position: relative;
  .content {
    position: relative;
    z-index: 999;
    text-align: center;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;

    .header {
      .cover {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        overflow: hidden;
        img {
          border-radius: 4px;
          width: 100%;
          height: 100%;
        }
      }

      .title {
        font-size: 20px;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: rgba(255, 255, 255, 1);
        line-height: 1.3;
        text-shadow: 0px 2px 4px rgba(218, 77, 25, 1);

        display: flex;
        flex-direction: column;
        justify-content: center;
      }
    }
    .body {
      .services {
        display: flex;
        justify-content: space-around;

        .service {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          margin: 10px auto;

          .icon {
            background: rgba(255, 255, 255, 0.94);
            width: 50px;
            height: 50px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;

            i {
              font-size: 28px;
              color: rgba(252, 114, 63, 1);
              display: block;
            }
          }
          span {
            font-size: 12px;
            font-weight: 600;
            color: rgba(254, 241, 235, 1);
            line-height: 14px;
            margin: 5px auto;
          }

          &-actived {
            animation: skipAnima 2s 2;
          }
        }
      }
      .coupon {
        width: 286px;
        height: 79px;

        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        .slogs {
          position: relative;
          width: 100%;

          font-size: 20px;
          font-family: PingFangSC-Semibold, PingFang SC;
          font-weight: 600;
          color: rgba(255, 255, 255, 1);
          text-shadow: 0px 3px 4px rgba(243, 154, 48, 1);

          .slog {
            position: absolute;
            left: 0px;
            right: 0px;
            text-align: center;
          }
        }

        .influence {
          font-size: 13px;
          font-family: PingFangSC-Semibold, PingFang SC;
          font-weight: 600;
          color: rgba(255, 255, 255, 1);
          line-height: 18px;
          text-shadow: 0px 3px 4px rgba(243, 154, 48, 1);
          margin-top: 30px;
          padding: 5px auto;

          span {
            font-size: 18px;
            font-family: Helvetica;
            color: rgba(255, 255, 255, 1);
            line-height: 22px;
            text-shadow: 0px 3px 4px rgba(243, 154, 48, 1);
          }
        }
      }
      .remark {
        font-size: 14px;
        color: rgba(255, 255, 255, 1);
        line-height: 1;
        margin-bottom: 25px;

        span {
          font-size: 16px;
          font-family: Helvetica;
          font-weight: 700;
          lin-height: 2;
        }
      }
    }
    .input {
      margin: 5px auto;
      background: #fff;
      border-radius: 8px;
      width: 100%;

      & ::v-deep .ai-input__input {
        font-size: 14px;
        font-family: FZLTZHK--GBK1-0, FZLTZHK--GBK1;
        font-weight: normal;
        color: rgba(155, 155, 155, 1);
        line-height: 19px;
        text-align: center;
        padding: 5px 0px;
        border-radius: 8px;
      }
    }
    .action {
      border: none;

      width: 243px;
      height: 50px;
      background: linear-gradient(
        180deg,
        rgba(254, 245, 142, 1) 0%,
        rgba(252, 199, 62, 1) 43%,
        rgba(252, 191, 52, 1) 77%,
        rgba(253, 212, 98, 1) 100%
      );
      box-shadow: 0px 8px 14px 0px rgba(0, 0, 0, 0.06),
        0px 8px 10px 0px rgba(197, 57, 38, 0.39);
      border-radius: 27px;

      font-size: 22px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: rgba(184, 85, 3, 1);
      line-height: 30px;
      text-shadow: 0px 8px 14px rgba(0, 0, 0, 0.06),
        0px 1px 2px rgba(0, 0, 0, 0.26);

      margin-top: 15px;
    }
  }

  .decorator {
    position: absolute;
    top: 0px;
    left: 0px;
    right: 0px;
    height: 50vh;
    overflow-x: hidden;

    .left {
      position: absolute;
      left: -80px;
      top: -100px;

      width: 225px;
      height: 242px;
      background: linear-gradient(
        151deg,
        rgba(255, 185, 100, 1) 0%,
        rgba(255, 131, 6, 0) 100%
      );
      box-shadow: 0px 8px 14px 0px rgba(0, 0, 0, 0.06);
      border-radius: 50%;
    }

    .right-top {
      position: absolute;
      right: 0px;
      top: -10px;

      width: 50px;
      height: 50px;
      background: linear-gradient(
        151deg,
        rgba(255, 185, 100, 1) 0%,
        rgba(255, 131, 6, 0) 100%
      );
      box-shadow: 0px 8px 14px 0px rgba(0, 0, 0, 0.06);
      border-radius: 50%;
    }

    .right {
      position: absolute;
      right: -100px;
      top: 80px;

      width: 225px;
      height: 242px;
      background: linear-gradient(
        151deg,
        rgba(255, 185, 100, 1) 0%,
        rgba(255, 131, 6, 0) 100%
      );
      box-shadow: 0px 8px 14px 0px rgba(0, 0, 0, 0.06);
      opacity: 0.74;
      border-radius: 50%;
    }
  }
  .success {
    margin: 50px auto;
    color: #fff;

    i {
      font-size: 72px;
    }
    p {
      font-weight: 600;
    }
  }
  .copyright {
    margin-top: 20px;
    color: #fff;
  }
}

@keyframes skipAnima {
  10% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}
</style>
