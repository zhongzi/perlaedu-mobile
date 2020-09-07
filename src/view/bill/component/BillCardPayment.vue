<template>
  <ai-state-check
    :checked="checked"
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
        :class="b('panel')"
        :showIcon="false"
        :open="innerPanelOpened && !isEmptyDesc"
        :enableHeaderClickable="false"
        @update:open="(v) => (innerPanelOpened = v)"
      >
        <template v-slot:header>
          <bill-card>
            <template v-slot:left-title>
              {{ innerItem.title }}
            </template>
            <template v-slot:left-remark v-if="!isEmptyDesc">
              <span
                class="description"
                @click.stop="innerPanelOpened = !innerPanelOpened"
              >
                费用详情
                <i
                  class="iconfont"
                  :class="innerPanelOpened ? 'icon-up' : 'icon-down'"
                />
              </span>
            </template>
            <template v-slot:right-title>
              {{ innerItem.price }} <span style="font-size: 12px;">元</span>
            </template>
            <template v-slot:right-remark>
              实际支付
            </template>
          </bill-card>
        </template>
        <template>
          <div class="remark">
            {{ innerItem.description }}
          </div>
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

import isEmpty from "lodash/isEmpty";

@Component({
  name: "bill-card-payment",
  components: {
    AiPanel,
    AiCellSwiper,
    BillCard,
    AiStateCheck,
  },
})
export default class Home extends Mixins(SyncMixin) {
  @Prop({ type: [Number, String], default: null }) itemId: number | String;
  @Prop({ type: Object, default: null }) item: any;
  @Prop({ type: String, default: "" }) outerTag: string;
  @Prop({ type: Boolean, default: true }) swiperEnable: boolean;
  @Prop({ type: Object, default: () => ({}) }) swiperOptions: any;
  @Prop({ type: Boolean, default: false }) checked: boolean;
  @Prop({ type: Boolean, default: false }) enableCheck: boolean;
  @Prop({ type: Boolean, default: false }) panelOpened: boolean;

  innerPanelOpened: boolean = false;

  get isEmptyDesc() {
    return !this.item || isEmpty(this.item.description);
  }

  get innerItem() {
    return this.item || this.entity;
  }

  created() {
    this.store = "billItem";
    this.tag = this.outerTag;
    this.innerPanelOpened = this.panelOpened;

    if (!this.item && this.itemId) {
      this.id = this.itemId as any;
      this.loadEntity({});
    }
  }

  onDelete() {
    this.store = "billItem";
    this.id = this.innerItem.id;
    this.tag = this.outerTag;
    this.deleteEntity({
      res: { id: this.id },
    });
  }

  onAction(event) {
    this.$emit(event, this.innerItem, this.outerTag);
  }
}
</script>
<style lang="scss" scoped>
.bill-card-payment {
  &__panel {
    border-radius: 8px;
    overflow: hidden;
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
  .remark {
    padding: 0px 20px;
  }
}
</style>
