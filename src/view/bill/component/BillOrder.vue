<template>
  <div class="wrapper">
    <ai-state-check
      :checked="checked"
      @update:checked="(val) => $emit('update:checked', val)"
      :enableCheck="enableCheck"
    >
      <ai-cell-swiper
        :options="swiperOptions"
        :enable="swiperEnable"
        @delete="onDelete"
        @action="onAction"
      >
        <ai-panel :open.sync="open">
          <template v-slot:header>
            <div class="header"></div>
            <div :class="b()">
              <div :class="b('left')">
                <img
                  :src="item | safe('user.avatar')"
                  :class="b('left-avatar')"
                />
                <div :class="b('left-content')">
                  <div>
                    <span :class="b('left-content-name')">
                      {{ item | safe("user.nickname") }}
                    </span>
                    <span :class="b('left-content-status')">
                      {{ status.text }}
                    </span>
                  </div>
                  <div>
                    {{ item | safe("vproject.title") }} -
                    {{ payItem | safe("vitem.title") }}
                  </div>
                  <div v-if="item.created_at">
                    创建时间: {{ item.created_at | defaultDate }}
                  </div>
                  <div v-if="item.paid_at">
                    支付时间: {{ item.paid_at | defaultDate }}
                  </div>
                  <div v-if="item.used_at">
                    核销时间: {{ item.used_at | defaultDate }}
                  </div>
                  <div>凭证: {{ item.hashed_id }}</div>
                </div>
              </div>
              <div :class="b('right')">
                <span
                  >(付)
                  {{ (item.pay_balance + item.balance_deducted) | round(2) }}
                  元</span
                >
                <span>(余) {{ item.balance_deducted | round(2) }} 元</span>
                <span>(总) {{ item.balance | round(2) }} 元 </span>
                <span
                  >(惠)
                  {{
                    (item.balance - (item.pay_balance + item.balance_deducted))
                      | round(2)
                  }}元</span
                >
                <span
                  >(值) {{ (item.value + item.balance_deducted) | round(2) }}
                  {{ valueUnit }}</span
                >
                <div :class="b('right-actions')" v-if="!isSimpleMode">
                  <hui-button
                    class="action"
                    v-if="item.status === 'paid'"
                    @click.native.stop="
                      $router.push({
                        name: 'billCostRechargeAi',
                        params: {
                          orderId: item.id,
                        },
                      })
                    "
                  >
                    核销
                  </hui-button>
                  <hui-button
                    class="action"
                    v-if="item.status === 'used'"
                    @click.native.stop="openCost = true"
                  >
                    核销记录
                  </hui-button>
                </div>
              </div>
            </div>
          </template>
          <template v-if="open">
            <div class="info">
              <div v-if="item.remark.length > 0" class="info-order">
                订单备注
                <span>{{ item.remark }} </span>
              </div>
              <div
                v-if="
                  $options.filters.safe(payItem, 'vitem.description', '')
                    .length > 0
                "
                class="info-pay"
              >
                套餐说明
                <span>{{ payItem.vitem.description }} </span>
              </div>
              <bill-order-items :order="item" v-if="welfareItems.length > 0" />
            </div>
          </template>
        </ai-panel>
      </ai-cell-swiper>
    </ai-state-check>
    <hui-dialog v-model="openCost" v-if="openCost">
      <div class="content">
        <bill-order-cost :order="item" />
      </div>
    </hui-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Mixins, Watch } from "vue-property-decorator";

import SyncMixin from "@/mixin/SyncMixin";
import { BillStatus } from "@/enum/bill_status";

import AiPanel from "@/view/component/AiPanel.vue";
import AiCellSwiper from "@/view/component/AiCellSwiper.vue";
import AiStateCheck from "@/view/component/AiStateCheck.vue";

import BillCard from "./BillCard.vue";
import BillOrderCost from "./BillOrderCost.vue";
import BillOrderItems from "./BillOrderItems.vue";

import find from "lodash/find";
import filter from "lodash/filter";
import _get from "lodash/get";

@Component({
  name: "bill-order",
  components: {
    AiPanel,
    AiCellSwiper,
    AiStateCheck,
    BillCard,
    BillOrderCost,
    BillOrderItems,
  },
})
export default class Home extends Mixins(SyncMixin) {
  @Prop({ type: Object }) item: any;
  @Prop({ type: String, default: "" }) outerTag: string;
  @Prop({ type: Boolean, default: true }) swiperEnable: boolean;
  @Prop({
    type: Object,
    default: () => ({
      width: 90,
      actions: [
        {
          text: "删除",
          backgroundColor: "#fd3d30",
          event: "delete",
          confirm: {
            title: "删除确认",
            message:
              "您正在执行删除，一旦执行， 将不可撤回， 请谨慎选择! 是否继续本操作?",
          },
        },
      ],
    }),
  })
  swiperOptions: any;
  @Prop({ type: Boolean, default: false }) checked: boolean;
  @Prop({ type: Boolean, default: false }) enableCheck: boolean;
  @Prop({ type: Boolean, default: false }) isSimpleMode: boolean;

  open: boolean = false;
  openCost: boolean = false;

  get status() {
    return BillStatus[this.item.status];
  }

  get payItem() {
    return find(this.item.items, { is_welfare: false });
  }

  get valueUnit() {
    return this.payItem.value_type === "course" ? "次课" : "元";
  }

  get welfareItems() {
    return filter(this.item.items, { is_welfare: true }) || [];
  }
  onDelete() {
    this.store = "billOrder";
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
.header {
  display: flex;
  flex-direction: column;

  padding-left: 20px;
  padding-top: 15px;
  color: #ed8b41;
}
.bill-order {
  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 5px 15px 15px;

  &__left {
    display: flex;
    align-items: center;

    &-avatar {
      width: 50px;
      border-radius: 50%;
      margin-right: 13px;
    }

    &-content {
      font-size: 11px;
      color: rgba(165, 165, 165, 1);
      line-height: 17px;
      letter-spacing: 1px;

      &-name {
        font-size: 13px;
        font-weight: bold;
        color: rgba(84, 84, 84, 1);
        line-height: 17px;
      }

      &-status {
        font-size: 13px;
        color: rgba(237, 139, 65, 1);
        line-height: 17px;
        letter-spacing: 1px;
      }
    }
  }
  &__right {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    min-width: 130px;

    font-size: 12px;
    color: rgba(165, 165, 165, 1);

    & :nth-child(1) {
      font-size: 15px;
      color: rgba(237, 139, 65, 1);
      font-weight: 600;
      line-height: 17px;
      letter-spacing: 1px;
    }

    & :nth-child(2) {
      font-size: 13px;
      font-weight: 600;
      line-height: 17px;
      letter-spacing: 1px;
    }

    &-actions {
      margin-top: 5px;

      .action {
        height: 30px;
        color: rgba(165, 165, 165, 1);
      }
    }
  }
}
.info {
  padding: 0px 10px;

  &-order {
    span {
      font-size: 12px;
      color: rgba(165, 165, 165, 1);
    }
  }
  &-pay {
    span {
      font-size: 12px;
      color: rgba(165, 165, 165, 1);
    }
  }
}
</style>
