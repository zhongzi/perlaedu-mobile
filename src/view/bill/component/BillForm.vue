<template>
  <hui-dialog
    :value="value"
    @input="(v) => $emit('input', v)"
    class="wrapper-form-campaign"
  >
    <div class="money">
      <template v-if="balance > 0">
        本次支付金额<span>{{ balance | round(2) }}</span
        >元
      </template>
      <template v-else>
        <span> 免费 </span>
      </template>
    </div>
    <div class="detail">
      <div class="title"><span class="line" /><span>购买须知</span></div>
      <ol class="content">
        <li>限时优惠！到期截止！请尽快完成支付！</li>
        <li>支付后请务必扫码关注领取付款凭证！</li>
        <li>本钜惠活动最终解释权归发起机构所有！</li>
      </ol>
      <label v-if="merchant">
        您正在给 <span>{{ merchant }}</span> 充值</label
      >
      <ai-input
        class="remark"
        :value="remark"
        @input="(v) => $emit('update:remark', v)"
        placeholder="订单备注(选填)"
      />
    </div>
    <div class="actions">
      <button @click="$emit('cancel')" class="cancel">取消</button>
      <button @click="$emit('submit', remark)" class="buy">确认支付</button>
    </div>
  </hui-dialog>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from "vue-property-decorator";

import AiInput from "@/view/component/AiInput.vue";

import isEmpty from "lodash/isEmpty";
import _get from "lodash/get";
import _set from "lodash/set";
import pickBy from "lodash/pickBy";
import cloneDeep from "lodash/cloneDeep";

@Component({
  components: {
    AiInput,
  },
})
export default class Home extends Vue {
  @Prop({ type: Number, default: 0 }) balance: number;
  @Prop({ type: String, default: null }) merchant: string;
  @Prop({ type: String, default: "" }) remark: string;
  @Prop({ type: Boolean, default: false }) value: boolean;
}
</script>
<style lang="scss" scoped>
.wrapper-form-campaign {
  & ::v-deep .h-dialog__dialog {
    background-image: url(~@/asset/image/buy-tip-bg@2x.png);
    background-size: 100% 100%;
    background-color: rgb(0, 0, 0, 0);
    min-width: 324px;
    min-height: 400px;
    padding: 30px 20px;
  }
  .money {
    text-align: center;
    font-size: 14px;
    font-weight: bold;
    color: rgba(74, 74, 74, 1);
    line-height: 18px;

    span {
      font-size: 36px;
      font-weight: bold;
      color: rgba(255, 131, 36, 1);
      line-height: 46px;
      margin: 0 10px;
    }
  }
  .detail {
    margin-top: 50px;
    max-height: 350px;
    overflow-y: scroll;
    overflow-x: hidden;

    .title {
      font-size: 13px;
      color: rgba(74, 74, 74, 1);
      line-height: 18px;
      letter-spacing: 1px;
      margin-left: 30px;

      display: flex;
      align-items: center;
      margin-bottom: 9px;

      .line {
        display: inline-block;
        margin-right: 10px;

        min-width: 3px;
        height: 13px;
        line-height: 18px;
        background: linear-gradient(
          117deg,
          rgba(255, 146, 73, 1) 0%,
          rgba(226, 99, 14, 1) 100%
        );
        border-radius: 2px;
      }
    }

    .content {
      text-align: left;
      list-style-type: decimal;
      list-style-position: outside;

      font-size: 11px;
      color: rgba(102, 102, 102, 1);
      line-height: 18px;
    }
    label {
      font-size: 12px;
      color: rgba(102, 102, 102, 1);

      span {
        font-size: 18px;
        color: rgba(255, 131, 36, 1);
        font-weight: 600;
      }
    }
    .remark {
      margin: 5px 10% 20px;
      padding: 20px;
    }
  }
  .actions {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-around;
    margin-bottom: 30px;

    .cancel {
      width: 120px;
      height: 46px;
      background: rgba(239, 239, 239, 1);
      border-radius: 26px;
      border: none;

      font-size: 14px;
      font-weight: bold;
      color: rgba(155, 155, 155, 1);
      line-height: 19px;
      letter-spacing: 1px;
    }
    .buy {
      width: 120px;
      height: 46px;
      background: rgba(250, 142, 69, 1);
      border-radius: 26px;
      border: none;

      font-size: 14px;
      font-weight: bold;
      color: rgba(255, 255, 255, 1);
      line-height: 19px;
      letter-spacing: 1px;
    }
  }
}
</style>
