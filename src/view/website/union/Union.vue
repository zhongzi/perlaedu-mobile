<template>
  <div class="wrapper union">
    <template v-if="union.id">
      <div class="decorator">
        <div class="left"></div>
        <div class="right-top"></div>
        <div class="right"></div>
      </div>
      <div class="content">
        <div class="header">
          <p>{{ union.name }}</p>
          <p>由 {{ union.count_merchants }} 家优质培训机构组成</p>
          <p>{{ totalFollowers }} 人正在关注</p>
        </div>
        <div class="merchants">
          <ai-circle-menu :menus="unionMerchants">
            <div class="union-logo">
              <img :src="require('@/asset/logo.union.png')" />
            </div>
            <template v-slot:item="{ menu }">
              <div class="item" @click="openWebiste(menu)" v-if="menu.merchant">
                <img
                  :src="getCover(menu) | alioss({ width: 75, height: 75 })"
                  class="logo"
                />
                <span> {{ menu | safe("merchant.name") }}</span>
              </div>
            </template>
          </ai-circle-menu>
        </div>
        <ai-copyright :manual="true" />
        <guide-entry class="guide" />
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Mixins } from "vue-property-decorator";

import SyncMixin from "@/mixin/SyncMixin";

import AiCircleMenu from "@/view/component/AiCircleMenu.vue";
import AiCopyright from "@/view/component/AiCopyright.vue";

import GuideEntry from "../guide/component/Entry.vue";

import sortBy from "lodash/sortBy";
import sumBy from "lodash/sumBy";
import _get from "lodash/get";
import isEmpty from "lodash/isEmpty";

@Component({
  components: {
    AiCircleMenu,
    AiCopyright,
    GuideEntry,
  },
})
export default class Home extends Mixins(SyncMixin) {
  get union() {
    return this.entity;
  }

  get unionMerchants() {
    return sortBy(
      this.union.union_merchants || [],
      (o) => -_get(o, "merchant.count_persons", 0)
    );
  }

  get totalFollowers() {
    return sumBy(this.unionMerchants || [], "merchant.count_persons");
  }

  created() {
    this.store = "union";
    this.id = this.$route.params.unionId;
  }

  getCover(unionMerchant) {
    const merchant = unionMerchant.merchant;
    if (!merchant) return;
    // return !isEmpty(merchant.logo_url) ? merchant.logo_url : merchant.cover_url;
    return merchant.cover_url;
  }

  openWebiste(unionMerchant) {
    this.$router.push({
      name: "websiteMerchant",
      params: {
        merchantId: unionMerchant.merchant_id,
      },
    });
  }
}
</script>
<style lang="scss" scoped>
.union {
  background: linear-gradient(
    133deg,
    rgba(255, 109, 47, 1) 0%,
    rgba(255, 100, 82, 1) 100%
  );
  box-shadow: 0px 8px 14px 0px rgba(0, 0, 0, 0.06);
  position: relative;

  img {
    width: 100%;
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

  .content {
    position: relative;
    min-height: 100vh;
    z-index: 20;

    padding-top: 27px;

    .header {
      text-align: center;

      p:nth-child(1) {
        font-size: 24px;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: #ffffff;
        line-height: 33px;
      }
      p:nth-child(2) {
        font-size: 16px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #9c3b10;
        line-height: 22px;
      }
      p:nth-child(3) {
        font-size: 18px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #ffffff;
        line-height: 2.5;
      }
    }

    .merchants {
      margin: 50px auto;

      & ::v-deep .center {
        box-shadow: 0px 5px 11px 0px #c64720;
      }

      .union-logo {
        padding: 10px;
        background: #fff;

        img {
          width: 100%;
        }
      }

      .item {
        width: 60px;
        height: 60px;
        position: relative;

        .logo {
          border-radius: 50%;
          height: 100%;
          width: 100%;
          border: 3px solid #fff;
        }
        span {
          text-align: center;
          display: inline-block;
          position: relative;
          left: -20px;
          width: 100px;

          color: #fff;
          font-size: 12px;
          font-weight: 600;
        }
      }
    }
  }
  .guide {
    margin: 0px 20px;
  }

  & ::v-deep .copyright {
    font-size: 14px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #9c3b10;
    line-height: 20px;
  }
}
</style>
