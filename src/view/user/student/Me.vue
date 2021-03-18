<template>
  <div class="wrapper student">
    <ai-cell class="header">
      <template v-slot:cover>
        <img :src="user.avatar" class="avatar" />
      </template>
      <template v-slot:title>
        <span class="name">{{ user.nickname }}</span>
      </template>
      <template v-slot:right>
        <div class="icons">
          <div class="icon" @click="gotoMessageBox">
            <i class="iconfont icon-message" />
            <span>消息</span>
          </div>
          <div class="icon" @click="gotoCouponBag">
            <i class="iconfont icon-coupon coupon" />
            <span>券包</span>
          </div>
          <div class="icon" @click="openAlbums">
            <i class="iconfont icon-album coupon" />
            <span>相册</span>
          </div>
          <div class="icon" @click="openNotices">
            <i class="iconfont icon-email email" />
            <span>通知</span>
          </div>
        </div>
      </template>
    </ai-cell>
    <album-list v-model="showAlbums" />
    <course-list />
    <quick-entry />
    <!--
    <wallet class="section s-wallet" />
    <share class="section s-share" />
-->
    <merchants class="section s-merchant" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

import AiCell from "@/view/component/AiCell.vue";

import Wallet from "./component/Wallet.vue";
import Share from "./component/Share.vue";
import Merchants from "./component/Merchants.vue";
import CourseList from "./component/CourseList.vue";
import QuickEntry from "./component/QuickEntry.vue";
import AlbumList from "./component/AlbumList.vue";
import NoticeList from "./component/NoticeList.vue";

@Component({
  components: {
    AiCell,
    Wallet,
    Share,
    Merchants,
    CourseList,
    QuickEntry,
    AlbumList,
    NoticeList,
  },
})
export default class Home extends Vue {
  showAlbums = false;

  get user() {
    return this.$auth.user;
  }

  gotoMessageBox() {
    window.location.href = this.$frontURLResolver.getMessages(null, {});
  }

  gotoCouponBag() {
    this.$router.push({
      name: "billProfileCoupons",
    });
  }

  openAlbums() {
    this.showAlbums = true;
  }

  openNotices() {
    this.$router.push({
      name: "notices",
    });
  }
}
</script>
<style lang="scss" scoped>
.student {
  .header {
    padding: 30px 10px;
    margin-bottom: 10px;

    background: #fff;
    box-shadow: 0px 3px 14px 0px rgba(0, 0, 0, 0.05);

    .avatar {
      width: 45px;
      border-radius: 12px;
    }
    .name {
      font-size: 14px;
      font-weight: 600;
      color: rgba(84, 84, 84, 1);
      line-height: 19px;

      margin-left: 10px;
    }

    .icons {
      display: flex;
      align-items: center;

      .icon {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        margin: 0px 10px;

        i {
          font-size: 24px;
          line-height: 1;
        }

        span {
          font-size: 12px;
          color: #928e8e;

          line-height: 1;
        }

        .coupon {
          font-size: 28px;
        }

        .email {
          font-size: 28px;
          font-weight: 800;
        }
      }
    }
  }

  .section {
    margin: 20px 21px;
  }
  .s-merchant {
    margin: 0px;
  }
}
</style>
