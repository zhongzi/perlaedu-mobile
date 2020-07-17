<template>
  <div class="wrapper merchant">
    <div class="container">
      <div class="info">
        <div class="name">
          <span> {{ merchant.name }} </span>
        </div>
        <div class="address" @click="show = true">
          <i class="iconfont icon-location" />
          <p>{{ merchant.location | safe("address") }}</p>
        </div>
        <div class="phone" @click="onCall(merchant.phone)">
          <i class="iconfont icon-call" />
          <span> {{ merchant.phone }} </span>
        </div>
      </div>
      <div class="follower">
        <hui-button type="primary" @click.native="onFollow">
          {{ isFollowed ? "已关注" : "点击关注" }}
        </hui-button>
        <span> {{ merchant.count_persons }} 人正在关注</span>
      </div>
    </div>
    <ai-location
      :show.sync="show"
      :gps="merchant.location | safe('gps', [])"
      :address="merchant.location | safe('address')"
      :title="merchant.name"
      :telephone="merchant.phone"
    />
    <hui-dialog v-model="showDialog">
      <div class="dialog">
        <img :src="merchant.scene_qrcode_url" />
        <span>【微信扫码关注】</span>
        <p>本机构将不定时派发现金红包优惠券</p>
      </div>
    </hui-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Mixins } from "vue-property-decorator";

import SyncMixin from "@/mixin/SyncMixin";

import AiLocation from "@/view/component/AiLocation.vue";

import isEmpty from "lodash/isEmpty";
import isEqual from "lodash/isEqual";
import _get from "lodash/get";

@Component({
  components: {
    AiLocation,
  },
})
export default class Home extends Mixins(SyncMixin) {
  @Prop({ type: Object, default: () => ({}) }) merchant: any;

  showDialog: boolean = false;
  show: boolean = false;

  get isFollowed() {
    return !isEmpty(this.merchant.me);
  }

  created() {
    this.store = "person";
  }

  onCall(phone) {
    if (isEmpty(phone)) return;
    window.open("tel:" + phone);
  }

  onFollow() {
    if (this.isFollowed) return;

    this.showDialog = true;
  }
}
</script>
<style lang="scss" scoped>
.merchant {
  .container {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .follower {
      width: 130px;
      display: flex;
      flex-direction: column;
      align-items: flex-end;

      span {
        font-size: 11px;
        color: #5f5a5a;
        margin-top: 5px;
      }
    }

    .info {
      line-height: 2;

      .name {
        span {
          font-size: 18px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 600;
          color: rgba(74, 74, 74, 1);
          line-height: 20px;
        }
      }

      .address {
        line-height: 1;
        display: flex;

        i {
          width: 12px;
          height: 15px;
          color: rgba(216, 30, 6, 1);
          margin-right: 10px;
        }
        p {
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: rgba(74, 74, 74, 1);
          line-height: 20px;
          margin: 0px;
        }
      }
      .phone {
        i {
          width: 13px;
          height: 14px;
          color: rgba(0, 0, 0, 1);
        }
        span {
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: rgba(74, 74, 74, 1);
          line-height: 20px;
        }
      }
    }
  }
  .dialog {
    text-align: center;
    padding: 20px 10px;
    img {
      width: 100%;
    }
  }
}
</style>
