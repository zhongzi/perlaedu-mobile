<template>
  <ai-panel :open.sync="open" class="wrapper coupon-m">
    <template v-slot:header>
      <div class="header">
        <ai-cell>
          <template v-slot:cover>
            <img class="cover" :src="user.avatar | alioss({ width: 120 })" />
          </template>
          <template v-slot:title>
            {{ user.nickname }}
          </template>
          <template v-slot:subtitle>
            <ai-badge :color="status.color">
              {{ status.text }}
            </ai-badge>
            <span>{{ item.title }}</span>
          </template>
        </ai-cell>
        <div class="remark">
          <div v-if="referrer.nickname">推荐人: {{ referrer.nickname }}</div>
          <div v-if="issue.created_at">
            领取时间: {{ issue.created_at | date("yyyy/MM/dd HH:mm") }}
          </div>
        </div>
      </div>
      <hui-button class="float-button" @click.native.stop="openDetail">
        详情
      </hui-button>
    </template>
    <div class="body">
      <div class="user" v-if="showContact">
        <div class="title">领卡人信息:</div>
        <div class="info">
          <div class="item" v-if="coupon.name.length > 0">
            姓名: {{ coupon.name }}
          </div>
          <div class="item" v-if="coupon.telephone.length > 0">
            联系方式 : {{ coupon.telephone }}
          </div>
          <div class="item" v-if="coupon.remark.length > 0">
            备注 : {{ coupon.remark }}
          </div>
        </div>
      </div>
      <div class="view" v-if="viewPaths.length > 0">
        <div class="title">传播关系:</div>
        <template v-for="(path, index) in viewPaths">
          <span :key="index">
            <i class="iconfont icon-right" v-if="index !== 0" />
            <span class="path">
              ({{ index + 1 }}){{ path && path.nickname }}
            </span>
          </span>
        </template>
      </div>
    </div>
  </ai-panel>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

import AiPanel from "@/view/component/AiPanel.vue";
import AiCell from "@/view/component/AiCell.vue";
import AiBadge from "@/view/component/AiBadge.vue";

import { BillCouponStatus } from "@/enum/bill_coupon_status";

import _get from "lodash/get";
import isEmpty from "lodash/isEmpty";

@Component({
  components: {
    AiPanel,
    AiCell,
    AiBadge,
  },
})
export default class Home extends Vue {
  @Prop({ type: Object, default: null }) coupon: any;
  @Prop({ type: String, default: null }) couponClickedRoute: string;

  open: boolean = false;

  get status() {
    return BillCouponStatus[this.coupon.status];
  }

  get viewPaths() {
    return _get(this.coupon, "view_paths", "").slice().reverse();
  }

  get showContact() {
    return (
      !isEmpty(this.coupon.name) ||
      !isEmpty(this.coupon.telephone) ||
      !isEmpty(this.coupon.remark)
    );
  }

  get user() {
    return _get(this.coupon, "user") || {};
  }

  get referrer() {
    return _get(this.coupon, "referrer") || {};
  }

  get item() {
    return _get(this.coupon, "item") || {};
  }

  get issue() {
    return _get(this.coupon, "issue") || {};
  }

  openDetail() {
    if (this.couponClickedRoute) {
      this.$router.push({
        name: this.couponClickedRoute,
        params: {
          couponId: this.coupon.id,
        },
      });
    } else {
      this.$emit("click", this.coupon);
    }
  }
}
</script>
<style lang="scss" scoped>
.coupon-m {
  width: 100%;
  padding: 10px;
  background: #fff;
  border-radius: 8px;
  margin: 5px auto;
  position: relative;

  .header {
    .cover {
      width: 48px;
      border-radius: 8px;
      margin-right: 10px;
    }
    .remark {
      margin-top: 10px;
      width: 100%;
      font-size: 11px;
      color: #9b9b9b;
      letter-spacing: 0;
      line-height: 1.5;
    }
  }
  .float-button {
    position: absolute;
    top: 0px;
    right: 0px;
    width: 76px;
    height: 36px;
    background: #b61227;
    border-radius: 0px 12px 0px 12px;
    font-size: 14px;
    color: #fff;
    letter-spacing: 0.35px;
    line-height: 36px;
    text-align: center;
    border: none;
  }
  .user {
    .title {
      line-height: 2;
    }
    .item {
      font-size: 11px;
      color: #9b9b9b;
      letter-spacing: 0;
      line-height: 1.5;
    }
  }
  .view {
    .title {
      line-height: 2;
    }
    span {
      font-size: 11px;
      color: #9b9b9b;
      letter-spacing: 0;
      line-height: 1.5;
    }
  }
}
</style>
