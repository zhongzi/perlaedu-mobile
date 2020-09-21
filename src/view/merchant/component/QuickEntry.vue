<template>
  <div class="wrapper quick-entry">
    <div class="entry" @click="openWebsite">
      <i class="iconfont icon-home" />
      <span> 门户 </span>
    </div>
    <div class="entry" @click="openQrcode">
      <i class="iconfont icon-qrcode" />
      <span> 二维码 </span>
    </div>
    <div class="entry" @click="openBirthday">
      <!--
      <ai-badge v-if="countBirthday" :content="countBirthday">
 -->
      <i class="iconfont icon-birthday" />
      <!--
      </ai-badge>
 -->
      <span> 生日提醒</span>
    </div>
    <div class="entry" @click="openRechargedList">
      <!--
      <ai-badge v-if="countRechargedList" :content="countRechargedList">
 -->
      <i class="iconfont icon-recharge" />
      <!--
      </ai-badge>
 -->
      <span> 续费提醒</span>
    </div>
    <div class="entry" @click="openSetting" v-if="isOwner">
      <i class="iconfont icon-setting" />
      <span>机构设置</span>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

import AiBadge from "@/view/component/AiBadge.vue";

import _get from "lodash/get";

@Component({
  components: {
    AiBadge,
  },
})
export default class Home extends Vue {
  @Prop({ type: Object, default: null }) merchant: any;

  get isOwner() {
    const userId = _get(this.merchant, "user_id");
    return !!(userId && userId === _get(this.$auth, "user.id"));
  }

  get countRechargedList() {
    return _get(this.merchant, "statistics.person.count_recharged_list", 0);
  }

  get countBirthday() {
    return _get(this.merchant, "statistics.person.count_birthday", 0);
  }

  openWebsite() {
    this.$router.push({
      name: "websiteMerchant",
      params: {
        merchantId: this.merchant.id,
      },
    });
    return;
  }

  openQrcode() {
    const url = this.$frontURLResolver.getMerchantQrcode(this.merchant);
    window.location.href = url;
    return;
  }

  openBirthday() {
    const url = this.$frontURLResolver.getBirthdayCalendar(this.merchant);
    window.location.href = url;
    return;
  }

  openRechargedList() {
    const url = this.$frontURLResolver.getRechargedList(this.merchant);
    window.location.href = url;
    return;
  }

  openSetting() {
    const url = this.$frontURLResolver.getSetting(this.merchant);
    window.location.href = url;
    return;
  }
}
</script>
<style lang="scss" scoped>
.quick-entry {
  width: 100%;

  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 5px 30px;

  .entry {
    padding: 5px auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    i {
      color: #fff;
      font-size: 24px;
      margin-bottom: 3px;
    }
    span {
      font-size: 13px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #ffffff;
      line-height: 18px;
    }
  }
}
</style>
