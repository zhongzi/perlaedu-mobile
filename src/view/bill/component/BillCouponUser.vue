<template>
  <div class="wrapper user">
    <ai-cell v-if="user" class="user" :showBottomLine="false">
      <template v-slot:cover>
        <img class="cover" :src="user.avatar | alioss({ width: 120 })" />
      </template>
      <template v-slot:title>
        <div class="title">{{ username }}</div>
      </template>
      <template v-slot:right v-if="showAction">
        <hui-button @click.native="onClick" class="button">
          发/销卡记录
        </hui-button>
      </template>
    </ai-cell>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

import AiCell from "@/view/component/AiCell.vue";

import _get from "lodash/get";
import isEmpty from "lodash/isEmpty";

@Component({
  components: {
    AiCell,
  },
})
export default class Home extends Vue {
  @Prop({ type: Object, default: null }) user: any;
  @Prop({ type: Boolean, default: true }) showAction: boolean;

  get username() {
    return _get(this.user, "student.realname", this.user.nickname);
  }

  get phone() {
    return _get(this.user, "phone");
  }

  onClick() {
    this.$router.push({
      name: "billManagementCoupons",
      query: {
        query: JSON.stringify({
          openid: this.user.openid,
        }),
      },
    });
  }
}
</script>
<style lang="scss" scoped>
.user {
  .cover {
    width: 50px;
    border-radius: 10px;
    margin-right: 10px;
  }
  .title {
    font-size: 16px;
    font-family: Helvetica;
    color: rgba(74, 74, 74, 1);
    line-height: 19px;
    letter-spacing: 1px;
    font-weight: 400;
  }
  .button {
    height: 32px;
    background: rgba(250, 142, 69, 1);
    border-radius: 4px;

    font-size: 13px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(255, 255, 255, 1);
    line-height: 18px;

    border: none;
  }
}
</style>
