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
        <div class="icons" v-if="false">
          <i class="iconfont icon-message" />
          <i class="iconfont icon-plan" />
        </div>
      </template>
    </ai-cell>
    <wallet class="section s-wallet" />
    <share class="section s-share" />
    <merchants class="section s-merchant" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

import AiCell from "@/view/component/AiCell.vue";

import Wallet from "./component/Wallet.vue";
import Share from "./component/Share.vue";
import Merchants from "./component/Merchants.vue";

@Component({
  components: {
    AiCell,
    Wallet,
    Share,
    Merchants,
  },
})
export default class Home extends Vue {
  get user() {
    return this.$auth.user;
  }
}
</script>
<style lang="scss" scoped>
.student {
  .header {
    padding: 30px 30px 10px;

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
      i {
        font-size: 24px;
        margin-left: 10px;
      }
    }
  }

  .section {
    margin: 20px 21px;
  }
  .s-share {
    margin: 0px 12px;
  }
  .s-merchant {
    margin: 0px;
  }
}
</style>
