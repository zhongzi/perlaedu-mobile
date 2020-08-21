<template>
  <div class="wrapper join">
    <ai-cell class="user">
      <template v-slot:cover>
        <img :src="$auth.user.avatar" class="avatar" />
      </template>
      <template v-slot:title>
        <span class="name"> {{ $auth.user.nickname }} </span>
      </template>
    </ai-cell>
    <div class="detail">
      <div class="angle"></div>
      <ai-card class="card">
        <template v-slot:body>
          <div class="content">
            <div class="point">
              {{ !isJoined ? "马上领取门户网站30天" : "已领取门户网站30天" }}
            </div>
            <div class="share">
              立即赠送好友30天门户，他人领取成功， 您将额外获得30天
            </div>
          </div>
          <hui-button class="action" @click.native="take">
            {{ !isJoined ? "马上领取" : "立即赠送" }}
          </hui-button>
        </template>
        <template v-slot:footer>
          <ai-line class="line" />
          <div class="footer">
            <i class="iconfont icon-history" />
            <span>每周100个门户网站免费体验名额</span>
          </div>
        </template>
      </ai-card>
    </div>
    <ai-dialog v-model="showDialog">
      <div class="dialog" :style="dlgStyle">
        <div class="header">
          <img :src="require('@/asset/logo.bg.png')" class="cover" />
          <div class="title">Ai教务</div>
        </div>
        <div class="content">
          <div class="services">
            <div class="service">
              <i class="iconfont icon-website" />
              <span>门户网站</span>
            </div>
            <div class="service">
              <i class="iconfont icon-management" />
              <span>教务管理</span>
            </div>
            <div class="service">
              <i class="iconfont icon-zhaosheng" />
              <span>活动招生</span>
            </div>
          </div>
          <div class="coupon" :style="couponStyle">
            <div>免费领取 <span> 30 </span> 天门户网站</div>
            <div><span>2000</span>家教培机构正在使用</div>
          </div>
          <div class="remark">
            <span> 789套 </span>教培机构 <span> 运营资料 </span>免费领
          </div>
          <ai-input
            placeholder="请输入您的手机号码"
            v-model="telephone"
            class="telephone"
          />
          <hui-button class="action" @click.native="save">
            立即领取
          </hui-button>
        </div>
      </div>
    </ai-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

import AiCell from "@/view/component/AiCell.vue";
import AiCard from "@/view/component/AiCard.vue";
import AiDialog from "@/view/component/AiDialog.vue";
import AiInput from "@/view/component/AiInput.vue";
import AiLine from "@/view/component/AiLine.vue";

import isEmpty from "lodash/isEmpty";

@Component({
  components: {
    AiCell,
    AiCard,
    AiDialog,
    AiInput,
    AiLine,
  },
})
export default class Home extends Vue {
  isJoinedCur: boolean = false;
  localKey: string = "newJoinWebsite";

  showDialog: boolean = false;
  telephone: string = "";

  get dlgStyle() {
    return {
      backgroundImage:
        "url(" +
        require("@/asset/image/dlg-coupon-bg" + this.$densityStr + ".png") +
        ")",
    };
  }

  get couponStyle() {
    return {
      backgroundSize: "100% 100%",
      backgroundImage:
        "url(" +
        require("@/asset/image/coupon-bg" + this.$densityStr + ".png") +
        ")",
    };
  }
  get isJoined() {
    return this.$db.nsGet(this.localKey) || this.isJoinedCur;
  }

  created() {
    this.telephone = this.$auth.user.phone;
    if (!this.isJoined) {
      this.showDialog = true;
    }

    this.$bus.$emit("config:share", {
      title: `我已为自己的校区开通了门户网站，并抢到了一个月使用权限赠送给你`,
      desc: "通过老生带新生，把招生量提高40%以上",
    });
  }

  take() {
    if (this.isJoined) {
      this.$bus.$emit("config:share:tip:show");
      return;
    }

    this.showDialog = true;
  }

  save() {
    if (
      isEmpty(this.telephone) ||
      !this.$tools.regxs.telephone(this.telephone)
    ) {
      this.$hui.toast.error("请输入正确的手机号码");
      return;
    }

    this.$wework
      .notifyForNewWebsite(
        this.$auth.user.nickname,
        this.$auth.user.openid,
        this.telephone,
        this.$route.query.merchant,
        this.$store.state.expose2
      )
      .then(() => {
        this.$db.nsSet(this.localKey, this.telephone, {
          date: new Date().getTime(),
        });
        this.$hui.toast.info("领取成功");
        this.isJoinedCur = true;
        this.showDialog = false;
      })
      .catch((e) => {
        this.$hui.toast.error("领取失败");
      });
  }
}
</script>
<style lang="scss" scoped>
.join {
  width: 100%;

  .user {
    .avatar {
      width: 62px;
      height: 62px;
      border-radius: 50%;
    }
    .name {
      margin-left: 10px;
      font-size: 18px;
      color: rgba(255, 249, 247, 1);
      line-height: 22px;
      letter-spacing: 1px;
    }
  }
  .detail {
    position: relative;
    margin: 15px auto;

    .angle {
      position: absolute;
      top: -10px;

      width: 0;
      height: 0;
      border: 30px solid transparent;
      border-left: 50px solid rgba(255, 255, 255, 0.94);
    }
    .card {
      position: relative;
      z-index: 99;
      background: rgba(255, 255, 255, 0.94);

      padding: 15px 20px 10px;

      & ::v-deep .ai-card__body {
        display: flex;
        justify-content: space-between;
      }

      .content {
        .point {
          font-size: 16px;
          font-weight: 600;
          color: rgba(74, 74, 74, 1);
          line-height: 2.5;
        }
        .share {
          font-size: 13px;
          font-weight: 400;
          color: rgba(84, 84, 84, 1);
          line-height: 1.5;
        }
      }
      .action {
        border: none;

        flex-basis: 140px;
        height: 32px;
        background: linear-gradient(
          178deg,
          rgba(250, 217, 97, 1) 0%,
          rgba(247, 107, 28, 1) 100%
        );
        box-shadow: 0px 8px 10px 0px rgba(197, 57, 38, 0.14);
        border-radius: 10px;

        font-size: 14px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: rgba(255, 255, 255, 1);
        line-height: 20px;
      }

      .line {
        margin: 10px auto;
      }

      .footer {
        display: flex;
        align-items: center;
        justify-content: space-between;

        font-size: 13px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: rgba(223, 113, 72, 1);
        line-height: 18px;
      }
    }
  }
}

::v-deep .h-dialog__dialog {
  background: inherit;
  width: 100% !important;
}

.dialog {
  position: relative;
  background-origin: border-box;
  background-size: cover;
  background-position: center;

  text-align: center;
  border-radius: 6px;
  width: 100%;
  min-height: 500px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;

  .header {
    position: absolute;
    top: -20px;
    left: calc(50% - 42.5px);

    .cover {
      width: 85px;
      height: 80px;
      border-radius: 4px;
      overflow: hidden;
      border: solid 2px #fff;

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

  .content {
    margin-top: 100px;

    .services {
      display: flex;
      justify-content: space-around;
      .service {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        margin: 10px auto;

        i {
          font-size: 28px;
          background: rgba(255, 255, 255, 0.94);
          border-radius: 50%;
          color: rgba(252, 114, 63, 1);
          padding: 15px;
        }
        span {
          font-size: 12px;
          font-weight: 600;
          color: rgba(254, 241, 235, 1);
          line-height: 14px;
          margin: 5px auto;
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

      & :nth-child(1) {
        font-size: 18px;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: rgba(255, 255, 255, 1);
        line-height: 18px;
        text-shadow: 0px 3px 4px rgba(243, 154, 48, 1);
        span {
          font-size: 28px;
          font-family: Helvetica;
          color: rgba(255, 255, 255, 1);
          line-height: 34px;
          text-shadow: 0px 3px 3px rgba(243, 154, 48, 1);
        }
      }

      & :nth-child(2) {
        font-size: 13px;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: rgba(255, 255, 255, 1);
        line-height: 18px;
        text-shadow: 0px 3px 4px rgba(243, 154, 48, 1);
        padding-bottom: 10px;

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
      font-size: 16px;
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

  .telephone {
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
</style>
