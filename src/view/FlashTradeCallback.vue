<template>
  <div class="wrapper flash-trade-callback">
    <div class="owner" v-if="owner">
      <img class="logo" v-if="logo" :src="owner.logo" />
      <span class="name"> {{ owner.name }} </span>
    </div>
    <div class="content">
      <span class="title"> {{ title || "支付成功" }} </span>
      <span class="remark">
        {{ remark || "本次支付已成功完成, 支付编号: " + id }}
      </span>
    </div>
    <div class="action" v-if="action">
      <ai-button-round-small class="action" @click.native="onBtnClicked">
        {{ action.name || "下一步" }}
      </ai-button-round-small>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Mixins } from "vue-property-decorator";

import SyncMixin from "@/mixin/SyncMixin";

import AiButtonRoundSmall from "@/view/component/AiButtonRoundSmall.vue";

import _get from "lodash/get";

@Component({
  components: {
    AiButtonRoundSmall,
  },
})
export default class Home extends Mixins(SyncMixin) {
  get order() {
    return this.entity;
  }

  get owner() {
    return _get(this.order, "callback_info.owner");
  }
  get title() {
    return _get(this.order, "callback_info.info.title");
  }
  get remark() {
    return _get(this.order, "callback_info.info.remark");
  }
  get action() {
    return _get(this.order, "callback_info.action");
  }

  created() {
    this.store = "payOrder";
    this.id = this.$route.query.out_trade_id;
    this.loadEntity();
  }

  onBtnClicked() {
    window.parent.location.href = this.action.url;
  }
}
</script>
<style lang="scss" scoped>
.flash-trade-callback {
  min-height: 300px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .owner {
    .logo {
      width: 70px;
      height: 70px;
      border-radius: 50%;
      box-shadow: 0px 0px 30px #ea8d0a;
    }
    .name {
      font-size: 18px;
      font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
      font-weight: bold;
      color: #ffffff;
      line-height: 31px;
      letter-spacing: 2px;
    }
  }

  .content {
    margin: 20px auto;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .title {
      font-size: 18px;
      font-weight: 600;
      color: #4a4a4a;
      line-height: 2;
    }

    .remark {
      font-size: 13px;
      color: #928e8e;
    }
  }
}
</style>
