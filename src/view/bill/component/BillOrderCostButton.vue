<template>
  <div class="wrapper bill-order-cost-btn">
    <ai-button-round @click.native.stop="open = true"> 核销 </ai-button-round>
    <ai-dialog v-model="open">
      <div class="dialog">
        <div class="methods">
          <div class="method">
            <div class="label">方式一，给已经注册的客户机构核销</div>
            <ai-button-round @click.native.stop="recharge"
              >代理直接核销</ai-button-round
            >
          </div>
          <div class="method">
            <div class="label">方式二，给未注册的客户机构核销</div>
            <div class="qrcode">
              <img :src="addMerchantUrl" />
              <span> 保存上述二维码，发给校长，继续完成本次注册充值流程</span>
            </div>
          </div>
          <ai-submit-actions submitLabel="" @cancel="open = false" />
        </div>
      </div>
    </ai-dialog>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

import AiButtonRound from "@/view/component/AiButtonRound.vue";
import AiDialog from "@/view/component/AiDialog.vue";
import AiSubmitActions from "@/view/component/AiSubmitActions.vue";

@Component({
  components: {
    AiButtonRound,
    AiDialog,
    AiSubmitActions,
  },
})
export default class Home extends Vue {
  @Prop({ type: Object, default: null }) order: any;

  open: boolean = false;

  get addMerchantUrl() {
    return this.$tools.resolveQrcode(this.$router, {
      name: "merchantAdd",
      query: {
        billOrderId: this.order.id,
      },
    });
  }

  recharge() {
    this.open = false;
    this.$nextTick(() => {
      this.$router.push({
        name: "billCostRechargeAi",
        params: {
          orderId: this.order.id,
        },
      });
    });
  }
}
</script>

<style lang="scss" scoped>
.bill-order-cost-btn {
}
.dialog {
  padding: 20px 10px;

  .methods {
    .method {
      margin-bottom: 30px;
      .label {
        font-size: 13px;
        font-weight: 800;
        line-height: 2;
      }
      .qrcode {
        display: flex;
        align-items: center;
        justify-content: center;

        img {
          width: 150px;
        }
        span {
          font-size: 12px;
          color: #4a4a4a;
        }
      }
    }
  }
}
</style>
