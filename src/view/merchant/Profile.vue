<template>
  <div class="wrapper profile">
    <ly-detail>
      <template v-slot:header>
        <img class="logo" :src="merchantLogo" />
        <div class="name">{{ merchantName }}</div>
      </template>
      <template>
        <div class="body">
          <div class="info">
            <div class="title">长按二维码关注公众号, 完成最后一步</div>
          </div>
          <div class="main">
            <img class="qrcode" :src="qrcode" />
            <div class="remark">长按二维码识别</div>
            <div class="rights">
              <span>开通后将获得</span>
              <ul class="right">
                <li><i class="iconfont icon-anquan" />机构专属二维码</li>
                <li><i class="iconfont icon-anquan" />操作演示教程</li>
                <li><i class="iconfont icon-anquan" />开始使用</li>
              </ul>
            </div>
          </div>
        </div>
      </template>
    </ly-detail>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Mixins } from "vue-property-decorator";

import SyncMixin from "@/mixin/SyncMixin";

import LyDetail from "@/view/layout/Detail.vue";

import _get from "lodash/get";

@Component({
  components: {
    LyDetail,
  },
})
export default class Home extends Mixins(SyncMixin) {
  qrcode: string = null;

  get merchantId() {
    return parseInt(
      _get(this.$route, "query.merchantId") ||
        _get(this.$auth, "user.curr_merch_id")
    );
  }

  get merchant() {
    return this.entity;
  }

  get merchantLogo() {
    return _get(this.merchant, "logo_url") || require("@/asset/logo.bg.png");
  }

  get merchantName() {
    return _get(this.merchant, "name");
  }

  created() {
    this.store = "merchant";
    this.loadMerchant();
  }

  @Watch("merchantId")
  onMerchantIdChanged() {
    this.loadMerchant();
  }

  loadMerchant() {
    if (!this.merchantId) return;
    this.id = this.merchantId;
    this.loadEntity({
      query: {
        extras: "scene_qrcode_url",
      },
    });
    this.loadMerchantCreatedQrcode();
  }

  loadMerchantCreatedQrcode() {
    this.saveEntity({
      store: "sceneTemp",
      query: {
        extras: "qrcode",
      },
      res: {
        merchant_id: this.id,
        type_: "merchant_created",
      },
      success: (resp) => {
        this.qrcode = resp.data.qrcode;
      },
    });
  }
}
</script>
<style lang="scss" scoped>
.profile {
  .logo {
    width: 70px;
    height: 70px;
    border-radius: 50%;
    box-shadow: 0px 0px 30px #ea8d0a;
    margin-bottom: 10px;
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
    padding: 10px;
    text-align: center;
    font-size: 12px;
    color: #4a4a4a;

    .info {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 30px 20% 10px;

      .title {
        font-size: 18px;
        font-weight: 600;
        color: #4a4a4a;
        line-height: 1.5;
      }
      .remark {
        font-size: 13px;
        color: #928e8e;
      }
    }

    .main {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      .qrcode {
        width: 150px;
      }
      .rights {
        margin-top: 20px;

        text-align: left;
        span {
          position: relative;
          font-size: 16px;
          font-weight: 700;
          color: #4a4a4a;
          line-height: 2;
        }
        ul {
          font-size: 14px;
          line-height: 1.5;

          i {
            color: green;
            font-size: 18px;
          }
        }
      }
    }
  }
}
</style>
