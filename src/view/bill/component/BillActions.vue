<template>
  <div class="bill-actions">
    <hui-button class="btn-pay" @click.native="openForm = true">
      <i class="iconfont icon-pay" />
      <span>立即支付 ({{ innerPayBalance | round(2) }}元)</span>
    </hui-button>

    <bill-form
      v-model="openForm"
      :project="project"
      :balance="innerPayBalance"
      :originBalance="payBalance"
      :target="target"
      :remark.sync="order.remark"
      :isEnabledBalance.sync="isEnabledBalance"
      :trigger="trigger"
      @submit="updateOrder"
      @cancel="onCancel"
      @update:target="(v) => (target = v)"
    />

    <div id="pay-poster" v-show="false" />
    <hui-dialog v-model="openPoster" class="qrcode">
      <div class="qrcode-container">
        <img :src="posterURL" />
      </div>
    </hui-dialog>

    <ai-float-action
      v-if="isManager"
      class="action action-qrcode"
      icon="qrcode"
      @click="openPoster = true"
    />
    <ai-float-action
      v-if="isManager"
      class="action"
      @click="
        $router.push({
          name: 'billManagementDashboard',
        })
      "
      icon="money"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Mixins, Watch } from "vue-property-decorator";

import AiInputCheck from "@/view/component/AiInputCheck.vue";
import AiFloatAction from "@/view/component/AiFloatAction.vue";
import BillForm from "./BillForm.vue";

import SyncMixin from "@/mixin/SyncMixin";
import PayMixin from "@/mixin/PayMixin";

import isNull from "lodash/isNull";
import last from "lodash/last";
import isEmpty from "lodash/isEmpty";
import cloneDeep from "lodash/cloneDeep";
import trim from "lodash/trim";
import _get from "lodash/get";
import find from "lodash/find";
import indexOf from "lodash/indexOf";
import sumBy from "lodash/sumBy";
import maxBy from "lodash/maxBy";
import filter from "lodash/filter";

@Component({
  components: {
    AiInputCheck,
    AiFloatAction,
    BillForm,
  },
})
export default class Home extends Mixins(SyncMixin, PayMixin) {
  @Prop({ type: Object, default: () => ({}) }) project: any;
  @Prop({ type: Object, default: () => ({}) }) item: any;
  @Prop({ type: Object, default: () => ({}) }) order: any;
  @Prop({ type: Number, default: 0 }) payBalance: any;
  @Prop({ type: Boolean, default: false }) isManager: boolean;
  @Prop({ type: Boolean, default: true }) checked: boolean;

  openForm: boolean = false;
  openPoster: boolean = false;

  poster: any = null;
  posterURL: string = "";

  target: any = null;
  isEnabledBalance: boolean = false;

  get innerPayBalance() {
    if (!this.trigger || !this.isEnabledBalance) return this.payBalance;

    const balance = this.payBalance - _get(this.target, "balance", 0);
    return balance < 0 ? 0 : balance;
  }

  get trigger() {
    // 是否允许选择余额支付
    return (
      _get(this.project, "is_enabled_balance") &&
      _get(this.item, "is_enabled_balance")
    );
  }

  get posterJson() {
    return {
      baseWidth: 684,
      template: {
        type: "image",
        value: require("../asset/pay.png"),
        options: {},
      },
      elements: [
        {
          type: "text",
          value: this.project.title,
          options: {
            x: 60,
            y: 40,
            width: 564,
            height: 140,
            verticalAlign: "middle",
            align: "center",
            fontSize: 50,
            lineHeight: 1.1,
            wrap: "char",
            fontStyle: "bold",
            fill: "#ffffff",
          },
        },
        {
          type: "image",
          value: this.$tools.makeQrcode(),
          options: {
            x: 172,
            y: 260,
            width: 340,
            height: 340,
            zIndex: 2,
          },
        },
        {
          type: "text",
          value: _get(this.project, "merchant.name"),
          options: {
            x: 200,
            y: 569,
            width: 284,
            height: 120,
            zIndex: 3,
            align: "center",
            verticalAlign: "middle",
            fontSize: 36,
            lineHeight: 1,
            wrap: "char",
            fontStyle: "bold",
            fill: "#000",
          },
        },
      ],
    };
  }

  created() {
    this.$bus.$on("save-order", this.createOrder);

    this.resetTarget();
    this.posterBuild();
  }

  @Watch("posterJson", { deep: true })
  onPosterJsonChanged() {
    this.posterBuild();
  }

  @Watch("$route", { deep: true })
  onRouteChanged() {
    this.resetTarget();
  }

  @Watch("order", { deep: true })
  onOrderChanged() {
    this.resetTarget();
  }

  resetTarget() {
    this.target = {
      id:
        parseInt(this.$route.query.merchantId as any) ||
        _get(this.order, "target_id"),
    };
    this.isEnabledBalance = _get(this.order, "is_enabled_balance");
  }

  posterBuild() {
    if (!this.project.title) return;
    if (!this.poster) {
      this.poster = new this.$PosterBuilder();
    }
    this.poster.setData(
      "pay-poster",
      `${this.project.title}.${this.project.merchant.title}.png`,
      this.posterJson.template,
      this.posterJson.elements,
      this.posterJson.baseWidth,
      null,
      (url) => {
        this.posterURL = url;
      }
    );
    this.poster.build();
  }

  createOrder() {
    if (this.payBalance <= 0) return;

    if (!this.trigger) {
      this.isEnabledBalance = false;
    }

    this.store = "billOrder";
    this.id = this.order.id;
    this.saveEntity({
      query: {
        extras: "scene_qrcode_url",
      },
      res: Object.assign({}, this.order, {
        is_enabled_balance: this.isEnabledBalance,
        target_id: _get(this.target, "id", 0),
        target_class: "Merchant",
      }),
      success: (resp) => {
        this.$nextTick(() => {
          this.$bus.$emit("reload-project");
        });
      },
    });
  }

  onCancel() {
    this.resetTarget();
    this.openForm = false;
  }

  updateOrder(next) {
    if (isNull(last(this.order.items))) {
      this.$hui.toast.error("您尚未选择所需要的套餐");
      return;
    }

    if (
      !find(this.project.items, (item) => {
        return !item.is_welfare && indexOf(this.order.items, item.id) >= 0;
      })
    ) {
      this.$hui.toast.error("您尚未选择所需要的套餐");
      return;
    }

    if (!this.checked) {
      this.$hui.toast.info("请先阅读并同意服务条款");
      return;
    }

    if (!this.trigger) {
      this.isEnabledBalance = false;
    }

    const target_id = _get(this.target, "id", 0);
    if (this.isEnabledBalance && target_id === 0) {
      this.$hui.toast.error("请选择机构进行余额支付");
      return;
    }

    this.store = "billOrder";
    this.id = this.order.id;
    this.saveEntity({
      query: {
        extras: "scene_qrcode_url",
      },
      res: Object.assign({}, this.order, {
        is_enabled_balance: this.isEnabledBalance,
        target_id: target_id,
        target_class: "Merchant",
      }),
      success: (resp) => {
        this.openForm = false;
        this.$nextTick(() => {
          this.gotoFlashTradePage(
            "bill",
            resp.data,
            next &&
              this.$router.updateNext({
                next: next,
                query: {
                  billOrderId: resp.data.id,
                },
              })
          );
        });
      },
    });
  }
}
</script>
<style lang="scss" scoped>
.bill-actions {
  text-align: center;

  .btn-pay {
    width: 306px;
    height: 52px;
    background: linear-gradient(
      140deg,
      rgba(255, 176, 22, 1) 0%,
      rgba(255, 160, 28, 1) 100%
    );
    box-shadow: 0px 14px 10px -8px rgba(255, 104, 6, 0.45);
    border-radius: 26px;
    border-color: transparent;

    margin: 10px 0px;

    font-size: 18px;
    font-weight: bold;
    color: rgba(255, 255, 255, 1);
    line-height: 21px;
    letter-spacing: 1px;
    text-shadow: 0px 2px 4px rgba(255, 132, 6, 1);
    i {
      font-size: 24px;
    }
  }

  .qrcode {
    &-container {
      img {
        vertical-align: middle;
        width: 100%;
        max-height: 100%;
      }
    }
  }
}
.action {
  left: auto;
  right: 20px;
}

.action-qrcode {
  bottom: 120px;
}
</style>
