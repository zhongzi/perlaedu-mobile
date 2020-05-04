<template>
  <bill-card :class="b()">
    <template v-slot:left>
      <div :class="b('header')">
        <img :src="merchant.logo_url" />
        <div :class="b('header-info')">
          <div>{{ merchant.name }}</div>
          <div @click="callPhone">联系电话: {{ merchant.phone }}</div>
          <div>当前剩余金额: {{ merchant.balance }}元</div>
          <div>最近充值时间: {{ merchant.latest_recharge | defaultDate }}</div>
          <div>注册时间: {{ merchant.created_at | defaultDate }}</div>
        </div>
      </div>
    </template>
    <template v-slot:right>
      <hui-button :class="b('action')" @click.native="onClick">
        充值
      </hui-button>
    </template>
  </bill-card>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

import BillCard from "./BillCard.vue";

@Component({
  name: "bill-merchant",
  components: {
    BillCard,
  },
})
export default class Home extends Vue {
  @Prop({ type: Object, default: () => ({}) }) merchant: any;

  onClick() {
    return this.$emit("click", this.merchant);
  }
  callPhone() {
    window.location.href = `tel:${this.merchant.phone}`;
  }
}
</script>
<style lang="scss" scoped>
.bill-merchant {
  &__header {
    display: flex;
    align-items: center;
    height: 100%;

    img {
      width: 40px;
      border-radius: 50%;
      margin-right: 10px;
    }
    &-info {
      display: flex;
      flex-direction: column;

      font-size: 11px;
      color: rgba(165, 165, 165, 1);
      line-height: 17px;
      letter-spacing: 1px;

      & :nth-child(1) {
        font-size: 15px;
        font-weight: bold;
        color: rgba(84, 84, 84, 1);
        line-height: 17px;
      }
    }
  }
}
</style>
