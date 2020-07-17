<template>
  <div class="bill-actions">
    <hui-button class="btn-pay" @click.native="openForm = true">
      <i class="iconfont icon-pay" />
      <span>立即支付 ({{ payBalance | round(2) }}元)</span>
    </hui-button>
    <div id="pay-poster" v-show="false" />
    <bill-form
      v-model="openForm"
      :merchant="queryForm.name"
      :remark.sync="order.remark"
      :balance="payBalance"
      @submit="onSubmit"
      @cancel="openForm = false"
    />
    <hui-dialog v-model="open" class="qrcode">
      <div class="qrcode-container">
        <img :src="posterURL" />
      </div>
    </hui-dialog>
    <ai-float-action
      v-if="isManager"
      label="收款码"
      @click="onOpen"
      bottom="160px"
    />
    <ai-float-action
      v-if="isManager"
      label="充值记录"
      @click="
        $router.push({
          name: 'billManagementDashboard',
        })
      "
      bottom="80px"
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
  @Prop({ type: Object, default: () => ({}) }) order: any;
  @Prop({ type: Number, default: 0 }) payBalance: any;
  @Prop({ type: Boolean, default: false }) isManager: boolean;
  @Prop({ type: Boolean, default: true }) checked: boolean;

  openForm: boolean = false;
  open: boolean = false;

  poster: any = null;
  posterURL: string = "";

  get queryForm() {
    return {
      name: this.$route.query.name,
      target_id: this.$route.query.target_id,
      target_class: this.$route.query.target_class,
    };
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
    this.posterBuild();

    this.$bus.$on("save-order", this.onSubmitBg);
  }

  @Watch("posterJson", { deep: true })
  onPosterJsonChanged() {
    this.posterBuild();
  }

  onOpen() {
    this.open = true;
  }

  posterBuild() {
    if (!this.project.title) return;
    if (!this.poster) {
      this.poster = new this.$PosterBuilder();
    }
    this.poster.setData(
      "pay-poster",
      this.posterJson.baseWidth,
      `${this.project.title}.${this.project.merchant.title}.png`,
      this.posterJson.template,
      this.posterJson.elements,
      (url) => {
        this.posterURL = url;
      }
    );
    this.poster.build();
  }

  onSubmitBg() {
    if (this.payBalance <= 0) return;

    this.store = "billOrder";
    this.id = this.order.id;
    this.saveEntity({
      query: {
        extras: "scene_qrcode_url",
      },
      res: Object.assign({}, this.order, { form: this.queryForm }),
      success: (resp) => {
        this.$nextTick(() => {
          this.$bus.$emit("reload-project");
        });
      },
    });
  }

  onSubmit() {
    this.openForm = false;

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

    this.store = "billOrder";
    this.id = this.order.id;
    this.saveEntity({
      query: {
        extras: "scene_qrcode_url",
      },
      res: Object.assign({}, this.order, { form: this.queryForm }),
      success: (resp) => {
        this.$nextTick(() => {
          this.gotoFlashTradePage("bill", resp.data);
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
</style>
