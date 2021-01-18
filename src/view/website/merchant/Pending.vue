<template>
  <div class="wrapper pending">
    <div class="title">当前机构门户尚未开通</div>
    <div class="container">
      <div class="merchant">
        <img :src="merchant.cover_url | alioss({ width: 80, height: 60 })" />
        <span class="name"> {{ merchant.name }} </span>
      </div>
      <div class="director">=></div>
      <div class="agent">
        <img :src="agentAvatar | alioss({ width: 80, height: 80 })" />
        <span class="name"> {{ agentName }} </span>
        <span class="role">(客户经理)</span>
        <ai-phone :phone="agentPhone" label="联系Ta，申请开通" />
      </div>
    </div>
    <ai-copyright :manual="true" />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Mixins } from "vue-property-decorator";

import SyncMixin from "@/mixin/SyncMixin";

import AiPhone from "@/view/component/AiPhone.vue";
import AiCopyright from "@/view/component/AiCopyright.vue";

import isEqual from "lodash/isEqual";
import _get from "lodash/get";
import merge from "lodash/merge";
import isEmpty from "lodash/isEmpty";
import startsWith from "lodash/startsWith";

@Component({
  components: {
    AiPhone,
    AiCopyright,
  },
})
export default class Home extends Mixins(SyncMixin) {
  agent: any = {};

  get merchant() {
    return this.entity;
  }

  get agentAvatar() {
    return isEmpty(this.agent.avatar)
      ? _get(this.agent, "user.avatar")
      : this.agent.avatar;
  }

  get agentName() {
    return isEmpty(this.agent.realname)
      ? _get(this.agent, "user.nickname")
      : this.agent.realname;
  }

  get agentPhone() {
    return isEmpty(this.agent.phone)
      ? _get(this.agent, "user.phone")
      : this.agent.phone;
  }

  created() {
    this.store = "merchant";
    this.id = this.$route.params.merchantId;

    this.loadAgent();
  }

  @Watch("merchant", { deep: true })
  onMerchantChanged() {
    this.loadAgent();
  }

  loadAgent() {
    this.loadEntityExtra({
      store: "agent",
      id: this.merchant.agent_id,
      query: {
        extras: "user",
      },
      success: (resp) => {
        this.agent = resp.data;
      },
    });
  }
}
</script>
<style lang="scss" scoped>
.pending {
  height: 100vh;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .title {
    font-size: 24px;
    font-weight: 500;
  }

  .container {
    min-height: 50vh;

    display: flex;
    align-items: center;
    justify-content: space-around;
    margin-bottom: 50px;

    .merchant {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      img {
        height: 80px;
        display: block;
        border-radius: 8px;
        margin: 10px;
      }
    }

    .name {
      font-size: 14px;
      letter-spacing: 1px;
    }

    .director {
      text-shadow: 0.1em 0.1em #050505;
      color: red;
      margin: 0px 0px 0px 20px;
    }
    .agent {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding-top: 40px;

      img {
        width: 80px;
        display: block;
        border-radius: 50%;
        margin: 10px;
      }

      .role {
        margin-bottom: 10px;
        color: #ff9e16;
        font-size: 13px;
      }

      & ::v-deep .ai-button-round-small {
        padding: 5px 10px;
        i {
          color: #ff9e16;
        }
      }
    }
  }
}
</style>
