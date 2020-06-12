<template>
  <ai-panel
    :class="b()"
    :open="innerPanelOpened"
    :enableHeaderClickable="false"
    @update:open="(v) => (innerPanelOpened = v)"
  >
    <template v-slot:header>
      <bill-card>
        <template v-slot:header v-if="showUser">
          <bill-coupon-user
            :class="b('user')"
            :user="coupon.user"
            :showAction="false"
          />
        </template>
        <template v-slot:left-title>
          {{ innerItem | safe("item.title") }}
        </template>
        <template v-slot:left-remark>
          <div>唯一凭证: {{ innerItem.hashed_id }}</div>
          <div>使用范围: {{ validScope }}</div>
          <div>有效期至: {{ innerItem.end_at | defaultDate }}</div>
        </template>
        <template v-slot:right-title>
          {{ innerItem | safe("item.value") }}
          <span style="font-size: 12px;">{{ valueType }}</span>
        </template>
        <template v-slot:right-remark>
          <span v-if="minBalance && minBalance > 0"
            >满{{ minBalance }}元可用
          </span>
        </template>
      </bill-card>
      <div :class="b('actions')" v-if="showActions">
        <hui-button @click.native="onClick" :type="actionType" v-if="showBtn"
          >{{ actionName }}
        </hui-button>
        <div @click.stop="innerPanelOpened = !innerPanelOpened" v-if="showDesc">
          <span style="color: #9b9b9b;"> 使用规则 </span>
          <i
            class="iconfont"
            :class="innerPanelOpened ? 'icon-up' : 'icon-down'"
          />
        </div>
      </div>
    </template>
    <template>
      {{ innerItem | safe("item.description") }}
    </template>
  </ai-panel>
</template>

<script lang="ts">
import { Component, Vue, Prop, Mixins, Watch } from "vue-property-decorator";

import SyncMixin from "@/mixin/SyncMixin";

import AiPanel from "@/view/component/AiPanel.vue";
import AiCellSwiper from "@/view/component/AiCellSwiper.vue";
import AiStateCheck from "@/view/component/AiStateCheck.vue";
import AiLine from "@/view/component/AiLine.vue";

import BillCard from "./BillCard.vue";
import BillButton from "./BillButton.vue";
import BillCouponUser from "./BillCouponUser.vue";

import { BillCouponStatus } from "@/enum/bill_coupon_status";
import { BillItemValueType } from "@/enum/bill_item_value_type";

import isEmpty from "lodash/isEmpty";

@Component({
  name: "bill-coupon",
  components: {
    AiPanel,
    AiCellSwiper,
    AiStateCheck,
    AiLine,
    BillCard,
    BillButton,
    BillCouponUser,
  },
})
export default class Home extends Mixins(SyncMixin) {
  @Prop({ type: [Number, String], default: null }) couponId: number | String;
  @Prop({ type: Object, default: null }) coupon: any;
  @Prop({ type: String, default: "" }) outerTag: string;
  @Prop({ type: Boolean, default: false }) panelOpened: boolean;
  @Prop({ type: Boolean, default: true }) showActions: boolean;
  @Prop({ type: Boolean, default: true }) showDesc: boolean;
  @Prop({ type: Boolean, default: true }) showBtn: boolean;
  @Prop({ type: Boolean, default: false }) showUser: boolean;

  innerPanelOpened: boolean = false;

  get innerItem() {
    return this.coupon || this.entity;
  }

  get actionName() {
    if (isEmpty(this.innerItem.status)) return "";

    if (this.innerItem.status === "taken") return "马上使用";

    console.log(this.innerItem.status);
    return BillCouponStatus[this.innerItem.status].text;
  }

  get actionType() {
    if (isEmpty(this.innerItem)) return "";

    if (this.innerItem.status === "taken") return "primary";
  }

  get valueType() {
    if (isEmpty(this.innerItem.item)) return "";

    return BillItemValueType[this.innerItem.item.value_type].text;
  }

  get minBalance() {
    if (isEmpty(this.innerItem.item)) return null;

    return this.innerItem.item.min_balance;
  }

  get validScope() {
    if (this.innerItem.merchant) {
      return `(机构)${this.innerItem.merchant.name}`;
    } else if (this.innerItem.union) {
      return `(线上综合体)${this.innerItem.union.name}`;
    }
    return "全平台";
  }

  created() {
    this.store = "billItem";
    this.tag = this.outerTag;
    this.innerPanelOpened = this.panelOpened;

    if (!this.coupon && this.couponId) {
      this.id = this.couponId as any;
      this.loadEntity({
        query: {
          extras: "hashed_id,item,union,merchant",
        },
      });
    }
  }

  onClick() {
    const routeName = "billProfileCouponDetail";
    if (this.$route.name === routeName) {
      this.$emit("click");
    } else {
      this.$router.push({
        name: routeName,
        params: {
          couponId: this.innerItem.id,
        },
      });
    }
  }
}
</script>
<style lang="scss" scoped>
.bill-coupon {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0px 2.13333vw 3.73333vw 0px rgba(0, 0, 0, 0.06);
  margin: 10px auto;
  width: 100%;

  & ::v-deep .bill-card {
    height: auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  &__actions {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-direction: row-reverse;

    max-width: 100%;
    padding: 10px;
  }

  .description {
    position: relative;
    top: 15px;
    display: flex;
    align-items: center;
    i {
      font-size: 24px;
    }
  }

  &__user {
    padding-top: 10px;
    padding-left: 20px;
    padding-bottom: 0px;
    box-shadow: none;

    & ::v-deep .cover {
      width: 28px;
    }
    & ::v-deep .ai-cell {
      min-height: auto;
    }
  }
}
</style>
