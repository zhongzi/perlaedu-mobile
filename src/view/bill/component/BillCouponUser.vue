<template>
  <div class="wrapper coupon-user">
    <ai-cell v-if="user" class="user" :title="username" :showBottomLine="false">
      <template v-slot:cover>
        <img class="cover" :src="user.avatar | alioss({ width: 120 })" />
      </template>
      <template v-slot:right v-if="showAction">
        <hui-button @click.native="onClick" class="button">
          TA过往核销记录
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
        openid: this.user.openid,
      },
    });
  }
}
</script>
<style lang="scss" scoped>
.coupon-user {
  background: #fff;
  padding: 15px 10px;
  border-radius: 8px;
  box-shadow: 0px 8px 14px 0px rgba(0, 0, 0, 0.06);

  .cover {
    width: 48px;
    border-radius: 50%;
  }
}
</style>
