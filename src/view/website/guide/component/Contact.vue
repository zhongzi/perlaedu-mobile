<template>
  <div class="wrapper contact">
    <ai-cell class="user">
      <template v-slot:cover>
        <img :src="require('@/asset/logo.bg.png')" class="avatar" />
      </template>
      <template v-slot:title>
        <span class="name"> 添加AI教务官方顾问 </span>
      </template>
      <template v-slot:subtitle>
        <span class="remark"> 领取798套教培机构运营资料 </span>
      </template>
      <template v-slot:right>
        <hui-button class="action" @click.native="showDialog = true">
          <i class="iconfont icon-phone" />
          <span>联系领取 </span>
        </hui-button>
      </template>
    </ai-cell>
    <div class="content">
      <img :src="require('../asset/image/files.jpeg')" />
      <hui-button class="action" @click.native="showDialog = true">
        <span>联系领取 </span>
      </hui-button>
    </div>
    <ai-dialog v-model="showDialog">
      <div class="dialog" :style="dlgStyle">
        <div class="header">
          <img :src="require('@/asset/logo.bg.png')" class="cover" />
          <div class="title">添加AI教务官方顾问</div>
        </div>
        <div class="content">
          <div class="call">
            <i class="iconfont icon-call" />
            <hui-button class="call-btn" @click.native="onClick">
              一键拨打
            </hui-button>
          </div>
          <div class="qrcode">
            <img
              :src="require('../asset/image/kefu.qrcode.jpeg')"
              class="qrocde"
            />
          </div>
          <div class="remark">
            <div><span> 扫码 </span>领取资料 <span> 开通 </span>门户网站</div>
            <div>加微信号 AI-jiaowu888</div>
          </div>
        </div>
      </div>
    </ai-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

import AiCell from "@/view/component/AiCell.vue";
import AiDialog from "@/view/component/AiDialog.vue";
import AiFixedFooter from "@/view/component/AiFixedFooter.vue";

@Component({
  components: {
    AiCell,
    AiDialog,
    AiFixedFooter,
  },
})
export default class Home extends Vue {
  showDialog: boolean = false;

  get dlgStyle() {
    return {
      backgroundImage:
        "url(" +
        require("@/asset/image/dlg-coupon-bg" + this.$densityStr + ".png") +
        ")",
    };
  }

  onClick() {
    window.location.href = `tel:19898815561`;
  }
}
</script>
<style lang="scss" scoped>
.wrapper {
  width: 100%;

  .user {
    margin: 30px auto 10px;

    align-items: flex-start;

    .avatar {
      width: 62px;
      height: 62px;
      border-radius: 50%;
      border: 2px solid #fff;
      margin-right: 5px;
    }
    .name {
      font-size: 16px;
      color: rgba(254, 246, 242, 1);
      line-height: 18px;
      font-weight: 600;
    }
    .remark {
      font-size: 12px;
      font-family: Helvetica;
      color: rgba(255, 255, 255, 1);
      line-height: 16px;
    }

    .action {
      width: 95px;
      height: 32px;
      background: linear-gradient(
        177deg,
        rgba(250, 217, 97, 1) 0%,
        rgba(247, 107, 28, 1) 100%
      );
      box-shadow: 0px 8px 10px 0px rgba(197, 57, 38, 0.14);
      border-radius: 10px;
      border: none;

      font-size: 14px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: rgba(255, 255, 255, 1);
      line-height: 20px;

      margin-top: 5px;
    }
  }
  .content {
    text-align: center;
    margin: 20px auto;
    img {
      width: 100%;
      box-shadow: 0px 14px 20px 0px rgba(0, 0, 0, 0.1),
        0px 8px 14px 0px rgba(0, 0, 0, 0.06);
      border-radius: 10px;
    }

    & > .action {
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
      box-shadow: 0px 8px 10px 0px rgba(197, 57, 38, 0.39);
      border-radius: 27px;

      font-size: 22px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: rgba(192, 96, 3, 1);
      line-height: 30px;
      text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.26);

      margin: 20px;
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
    width: 100%;
    position: absolute;
    top: -30px;

    .cover {
      width: 100px;
      height: 100px;
      border-radius: 50%;
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
    margin-top: 110px;

    .call {
      position: relative;

      i {
        position: absolute;
        left: 40px;

        font-size: 50px;
        color: #fff;
        font-weight: 600;
      }

      &-btn {
        margin: 20px;
        width: 223px;
        height: 46px;
        background: linear-gradient(
          180deg,
          rgba(254, 245, 142, 1) 0%,
          rgba(252, 199, 62, 1) 43%,
          rgba(252, 191, 52, 1) 77%,
          rgba(253, 212, 98, 1) 100%
        );
        box-shadow: 0px 8px 10px 0px rgba(197, 57, 38, 0.39);
        border-radius: 27px;

        border: none;

        font-size: 19px;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: rgba(192, 96, 3, 1);
        line-height: 26px;
      }
    }

    .qrcode {
      img {
        width: 190px;
        height: 190px;
        border-radius: 6px;
      }
    }

    .remark {
      & :nth-child(1) {
        font-size: 16px;
        color: rgba(255, 255, 255, 1);
        line-height: 2;

        span {
          font-size: 16px;
          font-family: Helvetica;
          font-weight: 700;
          lin-height: 2;
        }
      }

      & :nth-child(2) {
        font-size: 16px;
        font-family: Helvetica;
        color: rgba(255, 255, 255, 1);
        font-weight: 600;
        line-height: 2;
        text-shadow: 0px 8px 14px rgba(0, 0, 0, 0.06);
      }
    }
  }
}
</style>
