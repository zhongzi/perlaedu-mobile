<template>
  <div :class="b()">
    <ai-panel :open.sync="open" :enableHeaderClickable="false">
      <template v-slot:header>
        <bill-card :class="[b('item'), { [b('item-opened')]: open }]">
          <template v-slot:left-title>
            <div :class="b('item-title')">
              {{ innerItem.title }}
              <img style="width: 40px;" :src="coinImage" />
            </div>
          </template>
          <template v-slot:left-remark>
            <div :class="b('item-remark')">
              <span>
                {{ innerItem.is_overlay ? "可" : "不可" }}叠加 有效期:
                {{ innerItem.duration | distanceFromSeconds }}
              </span>
              <span class="description" @click.stop="open = !open">
                福利详情
                <i class="iconfont" :class="open ? 'icon-up' : 'icon-down'" />
              </span>
            </div>
          </template>
          <template v-slot:right>
            <div :class="b('item-pointer')" @click="onPicked">
              <i class="iconfont icon-pointer" />
              <span> {{ checked ? "已领取" : "领取" }} </span>
            </div>
          </template>
        </bill-card>
      </template>
      <template>
        {{ innerItem.description }}
      </template>
    </ai-panel>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Mixins } from "vue-property-decorator";

import SyncMixin from "@/mixin/SyncMixin";

import AiPanel from "@/view/component/AiPanel.vue";
import AiCellSwiper from "@/view/component/AiCellSwiper.vue";

import BillCard from "./BillCard.vue";

@Component({
  name: "bill-card-welfare-drawable",
  components: {
    AiPanel,
    AiCellSwiper,
    BillCard,
  },
})
export default class Home extends Mixins(SyncMixin) {
  @Prop({ type: [Number, String], default: null }) itemId: number | String;
  @Prop({ type: Object, default: null }) item: any;
  @Prop({ type: String, default: "" }) outerTag: string;
  @Prop({ type: Boolean, default: false }) checked: boolean;

  open: boolean = false;

  get coinImage() {
    return require("@/asset/image/coin" + this.$densityStr + ".png");
  }

  get innerItem() {
    return this.item || this.entity;
  }

  created() {
    this.store = "billItem";
    this.tag = this.outerTag;

    if (!this.item && this.itemId) {
      this.id = this.itemId as any;
      this.loadEntity({});
    }
  }

  onPicked() {
    this.$emit("picked");
  }
}
</script>
<style lang="scss" scoped>
.bill-card-welfare-drawable {
  & ::v-deep .ai-panel__header {
    background: rgba(255, 255, 255, 0);
  }

  &__item-opened {
    border-radius: 8px 8px 0px 0px;
  }

  &__item-title {
    display: flex;
    align-items: center;
    img {
      margin-left: 10px;
    }
  }

  &__item-remark {
    margin-top: 5px;
    & :nth-child(1) {
      font-size: 12px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: rgba(74, 74, 74, 1);
      line-height: 17px;
    }
  }

  &__item-pointer {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    width: 65px;
    height: 65px;
    background: linear-gradient(
      140deg,
      rgba(255, 176, 22, 1) 0%,
      rgba(255, 160, 28, 1) 100%
    );
    box-shadow: 0px 14px 10px -8px rgba(255, 104, 6, 0.45);
    border-radius: 8px;

    color: rgba(255, 255, 255, 1);

    i {
      font-size: 32px;
    }

    span {
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      line-height: 20px;
      text-shadow: 0px 2px 4px rgba(255, 132, 6, 1);
    }
  }
}
</style>
