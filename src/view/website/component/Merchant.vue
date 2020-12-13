<template>
  <div class="wrapper merchant">
    <div class="container" :style="skin">
      <div class="info">
        <div class="name">
          <span :style="skin.title"> {{ merchant.name }} </span>
        </div>
        <div class="address" @click="show = true" v-if="merchant.location">
          <i class="iconfont icon-location" />
          <p>{{ merchant.location.address }}</p>
        </div>
        <div
          class="phone"
          @click="onCall(merchant.phone)"
          v-if="merchant.phone"
        >
          <i class="iconfont icon-call" :style="skin | safe('icon.phone')" />
          <span> {{ merchant.phone }} </span>
        </div>
      </div>
      <div class="follower">
        <hui-button type="primary" @click.native="onFollow">
          {{ isFollowed ? "已关注" : "点击关注" }}
        </hui-button>
        <span>
          {{ merchant.count_persons + (followed ? 1 : 0) }} 人正在关注</span
        >
      </div>
    </div>
    <ai-location
      v-if="show"
      :show.sync="show"
      :gps="merchant.location | safe('gps', [])"
      :address="merchant.location | safe('address')"
      :title="merchant.name"
      :telephone="merchant.phone"
    />
    <hui-dialog v-model="showDialog">
      <div class="dialog">
        <img :src="merchant.scene_qrcode_url" />
        <div>【微信扫码关注】</div>
        <div>本机构将不定时派发现金红包优惠券</div>
      </div>
      <div class="close" @click="showDialog = false">
        <i class="iconfont icon-close" />
      </div>
    </hui-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Mixins } from "vue-property-decorator";

import SyncMixin from "@/mixin/SyncMixin";

import AiLocation from "@/view/component/AiLocation.vue";

import { PersonRole } from "@/enum/person_role";

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

  followed: boolean = false;

  get skin() {
    const skin = _get(this.merchant, "website.skin.merchant", {});
    return skin;
  }

  get isFollowed() {
    return (
      (!isEmpty(this.merchant.me) &&
        (this.merchant.me.role & PersonRole.guest.value) > 0) ||
      this.followed
    );
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

    if (!this.$auth.user.is_subscribed) {
      this.showDialog = true;
      return;
    }

    this.beGuest();
  }

  beGuest() {
    const role = _get(this.merchant, "me.role") || 0;
    this.id = _get(this.merchant, "me.id");
    this.saveEntity({
      res: {
        id: this.id,
        merchant_id: (!this.id && this.merchant.id) || undefined,
        role: role | PersonRole.guest.value,
      },
      success: () => {
        this.followed = true;
        this.$hui.toast.info("关注成功");
      },
    });
  }
}
</script>
<style lang="scss" scoped>
.merchant {
  .container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: rgba(74, 74, 74, 1);

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
          line-height: 20px;
        }
        margin-bottom: 12px;
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
          line-height: 1;
        }
      }
    }
  }
  .dialog {
    padding: 50px;
    text-align: center;

    img {
      width: 100%;
    }
    div {
      font-size: 12px;
      line-height: 1.5;
    }
  }
  .close {
    position: relative;
    text-align: center;
    bottom: -50px;
    i {
      padding: 10px;
      border: 1px solid #fff;
      border-radius: 50%;
      color: #fff;
    }
  }
}
</style>
