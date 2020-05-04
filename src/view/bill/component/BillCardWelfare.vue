<template>
  <ai-state-check
    :checked="checked"
    :disabled="!isValid"
    @update:checked="(val) => $emit('update:checked', val)"
    :enableCheck="enableCheck"
  >
    <ai-cell-swiper
      :class="b()"
      :options="swiperOptions"
      :enable="swiperEnable"
      @delete="onDelete"
      @action="onAction"
    >
      <ai-panel
        :open.sync="open"
        :enableHeaderClickable="false"
        :class="b('panel')"
      >
        <template v-slot:header>
          <bill-card>
            <template v-slot:left-title>
              {{ innerItem.title }}
            </template>
            <template v-slot:left-remark>
              <div :class="b('remark')">
                <p>{{ countDown }}</p>
                <p>
                  <span v-if="item.min_balance > 0"
                    >满{{ item.min_balance }}元可用
                  </span>
                  <span>{{ innerItem.is_overlay ? "可" : "不可" }}叠加 </span>
                </p>
                <p :class="b('remark-entry')" @click.stop="open = !open">
                  <span
                    >有效期:{{ innerItem.duration | distanceFromSeconds }}
                  </span>
                  <span v-if="!isEmptyDesc">
                    福利详情
                    <i
                      class="iconfont"
                      :class="open ? 'icon-up' : 'icon-down'"
                    />
                  </span>
                </p>
              </div>
            </template>
            <template v-slot:right>
              <img style="width: 100px;" :src="coinImage" />
            </template>
          </bill-card>
        </template>
        <template>
          {{ innerItem.description }}
        </template>
      </ai-panel>
    </ai-cell-swiper>
  </ai-state-check>
</template>

<script lang="ts">
import { Component, Vue, Prop, Mixins, Watch } from "vue-property-decorator";

import SyncMixin from "@/mixin/SyncMixin";

import AiPanel from "@/view/component/AiPanel.vue";
import AiCellSwiper from "@/view/component/AiCellSwiper.vue";
import AiStateCheck from "@/view/component/AiStateCheck.vue";

import BillCard from "./BillCard.vue";

import _get from "lodash/get";
import isEmpty from "lodash/isEmpty";

@Component({
  name: "bill-card-welfare",
  components: {
    AiPanel,
    AiCellSwiper,
    AiStateCheck,
    BillCard,
  },
})
export default class Home extends Mixins(SyncMixin) {
  @Prop({ type: [Number, String], default: null }) itemId: number | String;
  @Prop({ type: Object, default: null }) item: any;
  @Prop({ type: Object, default: null }) payItem: any;
  @Prop({ type: Object, default: null }) order: any;
  @Prop({ type: String, default: "" }) outerTag: string;
  @Prop({ type: Boolean, default: true }) swiperEnable: boolean;
  @Prop({ type: Object, default: () => ({}) }) swiperOptions: any;
  @Prop({ type: Boolean, default: false }) checked: boolean;
  @Prop({ type: Boolean, default: false }) enableCheck: boolean;

  open: boolean = false;
  countDown: string = "";
  inter: any = null;

  isPasting: boolean = false;

  get isEmptyDesc() {
    return !this.item || isEmpty(this.item.description);
  }

  get coinImage() {
    return require("@/asset/image/coin" + this.$densityStr + ".png");
  }

  get innerItem() {
    return this.item || this.entity;
  }

  get isValid() {
    return this.isMatched && !this.isPast;
  }

  get isMatched() {
    return (
      !this.payItem || this.item.min_balance <= _get(this.payItem, "price", 0)
    );
  }

  get isPast() {
    return (
      (this.order &&
        this.order.end_at &&
        this.$options.filters.isPast(this.order.end_at)) ||
      this.isPasting
    );
  }

  created() {
    this.store = "billItem";
    this.tag = this.outerTag;

    if (!this.item && this.itemId) {
      this.id = this.itemId as any;
      this.loadEntity({});
    }

    this.startCountDownInterval();
    this.resetCountDown();
    this.onSwitchStatus();
  }

  beforeDestory() {
    this.stopCountDownInterval();
  }

  @Watch("order", { deep: true })
  onOrderChanged() {
    this.startCountDownInterval();
    this.resetCountDown();
  }

  @Watch("isValid")
  onIsValidChanged() {
    this.onSwitchStatus();
  }

  onSwitchStatus() {
    this.$emit("switch-status", {
      id: this.item.id,
      price: this.isValid ? this.item.price : 0,
    });
  }

  startCountDownInterval() {
    if (!this.order) return;
    if (!this.order.end_at) return;
    if (this.isPast) return;
    if (this.inter) return;

    this.inter = setInterval(this.resetCountDown, 1000);
  }

  stopCountDownInterval() {
    if (this.inter) {
      clearInterval(this.inter);
      this.inter = null;
    }
  }

  resetCountDown() {
    const getCountDown = () => {
      if (!this.order) return "";
      if (!this.order.end_at) return "有效";
      if (this.$options.filters.isPast(this.order.end_at)) {
        this.isPasting = true;
        return "已失效";
      }

      return (
        "还有 " +
        this.$options.filters.distanceFromDatetime(this.order.end_at) +
        " 结束"
      );
    };
    this.countDown = getCountDown();
  }

  onDelete() {
    this.store = "billItem";
    this.id = this.item.id;
    this.tag = this.outerTag;
    this.deleteEntity({
      res: { id: this.id },
    });
  }

  onAction(event) {
    this.$emit(event, this.item, this.outerTag);
  }
}
</script>
<style lang="scss" scoped>
.bill-card-welfare {
  &__panel {
    border-radius: 8px;
    overflow: hidden;
  }
  &__remark {
    font-size: 12px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: rgba(155, 155, 155, 1);
    line-height: 17px;

    p {
      margin: 0px;
    }
  }
}
</style>
