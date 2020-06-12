<template>
  <div class="wrapper merchant">
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
    <ai-location
      :show.sync="show"
      :gps="merchant.location | safe('gps', [])"
      :address="merchant.location | safe('address')"
      :title="merchant.name"
      :telephone="merchant.phone"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

import AiLocation from "@/view/component/AiLocation.vue";

import isEmpty from "lodash/isEmpty";
import isEqual from "lodash/isEqual";
import _get from "lodash/get";

@Component({
  components: {
    AiLocation,
  },
})
export default class Home extends Vue {
  @Prop({ type: Object, default: () => ({}) }) merchant: any;

  show: boolean = false;

  onCall(phone) {
    if (isEmpty(phone)) return;
    window.open("tel:" + phone);
  }
}
</script>
<style lang="scss" scoped>
.merchant {
  padding-left: 27px;

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
</style>
