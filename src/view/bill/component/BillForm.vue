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
      <template v-if="originBalance - balance > 0">
        <div class="deducted-remark">
          余额抵扣: {{ (originBalance - balance) | round(2) }} 元
        </div>
      </template>
    </div>
    <div class="detail">
      <div class="title"><span class="line" /><span>购买须知</span></div>
      <ol class="content">
        <li>限时优惠！到期截止！请尽快完成支付！</li>
        <li>支付后请务必扫码关注领取付款凭证！</li>
        <li>本钜惠活动最终解释权归发起机构所有！</li>
      </ol>
      <div
        class="target"
        v-if="isRechargeAi && merchants && merchants.length > 0"
      >
        <div class="title">
          <span class="line" /><span>选择目标充值机构</span>
        </div>
        <ai-selection
          class="selector"
          :value="targetId"
          :options="merchants"
          :enableUnsetOption="true"
          valueKey="id"
          @input="selected"
        >
          <template v-slot:option="{ option }">
            <div class="option">
              {{ option.name }} (余额 {{ option.balance }} 元)
            </div>
          </template>
        </ai-selection>
        <ai-input-check
          v-if="trigger"
          :value="isEnabledBalance"
          @input="(v) => $emit('update:isEnabledBalance', v)"
          class="check"
        >
          是否使用余额支付
        </ai-input-check>
      </div>
      <ai-input
        class="remark"
        mode="border"
        :value="remark"
        @input="(v) => $emit('update:remark', v)"
        placeholder="订单备注(选填)"
      />
    </div>
    <div class="actions">
      <button @click="$emit('cancel')" class="cancel">取消</button>
      <button @click="$emit('submit')" class="buy">确认支付</button>
    </div>
  </hui-dialog>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from "vue-property-decorator";

import AiInput from "@/view/component/AiInput.vue";
import AiInputCheck from "@/view/component/AiInputCheck.vue";
import AiSelection from "@/view/component/AiSelection.vue";

import isEmpty from "lodash/isEmpty";
import _get from "lodash/get";
import _set from "lodash/set";
import find from "lodash/find";
import pickBy from "lodash/pickBy";
import cloneDeep from "lodash/cloneDeep";

@Component({
  components: {
    AiInput,
    AiInputCheck,
    AiSelection,
  },
})
export default class Home extends Vue {
  @Prop({ type: Boolean, default: false }) value: boolean;
  @Prop({ type: Object, default: () => ({}) }) project: any;
  @Prop({ type: Boolean, default: false }) trigger: boolean;
  @Prop({ type: Boolean, default: false }) isEnabledBalance: boolean;
  @Prop({ type: Number, default: 0 }) balance: number;
  @Prop({ type: Number, default: 0 }) originBalance: number;
  @Prop({ type: Object, default: null }) target: any;
  @Prop({ type: String, default: "" }) remark: string;

  get merchants() {
    return _get(this.$auth, "user.merchants", []);
  }

  get targetId() {
    return this.target && this.target.id;
  }

  get isRechargeAi() {
    return _get(this.project, "channel.code") === "RechargeAi";
  }

  @Watch("value")
  onValueChanged() {
    this.value && this.selected(this.target.id);
    console.log(this.target.id);
  }

  selected(id) {
    if (id === "") {
      this.$emit("update:target", { id: 0 });
    }

    const m = find(this.merchants, { id: id });
    if (isEmpty(m)) return;
    this.$emit("update:target", m);
  }
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

    .deducted-remark {
      font-size: 11px;
      color: rgba(102, 102, 102, 1);
      line-height: 18px;
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

    .target {
      margin: 10px auto;
      padding: 0px 30px;

      .check {
        margin: 0px 10px;

        & ::v-deep .ai-input-check__vec-fake {
          background: red;
        }
      }

      .title {
        margin-left: 0px;
        margin-bottom: 0px;
      }

      .selector {
        padding: 0px;

        & ::v-deep .ai-select__select {
          padding-left: 10px;
        }
      }
    }

    .content {
      text-align: left;
      list-style-type: decimal;
      list-style-position: outside;
      margin-left: 40px;

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
