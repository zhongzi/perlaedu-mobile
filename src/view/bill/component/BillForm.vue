<template>
  <ai-dialog
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
      <template v-if="!isRechargeAi">
        <div class="title"><span class="line" /><span>购买须知</span></div>
        <ol class="content">
          <li>限时优惠！到期截止！请尽快完成支付！</li>
          <li>支付后请务必扫码关注领取付款凭证！</li>
          <li>本钜惠活动最终解释权归发起机构所有！</li>
        </ol>
      </template>

      <template v-else>
        <div class="recharge-ai">
          <template v-if="isOriginTarget">
            <div class="origin-target">
              正在为<span> {{ originTarget.name }} </span>付款
            </div>
          </template>
          <template v-else>
            <div class="choice register" @click="method = 'new'">
              <ai-input-radio
                value="new"
                :checked="method === 'new'"
                title="付款并完成新学校注册"
                subtitle="付完款后将进入注册学校流程"
                @change="onMethodChange"
              />
            </div>
            <div
              class="choice selected"
              v-if="merchants && merchants.length > 0"
              @click="method = 'select'"
            >
              <ai-input-radio
                value="select"
                :checked="method === 'select'"
                title="为已注册学校付款"
                @change="onMethodChange"
              />
              <ai-selection
                class="selector"
                :value="innerTarget && innerTarget.id"
                :options="merchants"
                valueKey="id"
                @selected="onSelected"
                @click.native="method = 'select'"
              >
                <template v-slot:option="{ option }">
                  <div class="option">
                    {{ option.name }}
                    <span v-if="option.id > 0"
                      >(余额 {{ option.balance }} 元)
                    </span>
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
            <div class="choice none" @click="method = 'none'">
              <ai-input-radio
                value="none"
                :checked="method === 'none'"
                title="只完成付款"
                @change="onMethodChange"
              />
            </div>
          </template>
        </div>
      </template>
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
      <button @click="buy" class="buy">确认支付</button>
    </div>
  </ai-dialog>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop, Mixins } from "vue-property-decorator";

import SyncMixin from "@/mixin/SyncMixin";

import AiDialog from "@/view/component/AiDialog.vue";
import AiInput from "@/view/component/AiInput.vue";
import AiInputCheck from "@/view/component/AiInputCheck.vue";
import AiInputRadio from "@/view/component/AiInputRadio.vue";
import AiSelection from "@/view/component/AiSelection.vue";
import AiButtonRoundSmall from "@/view/component/AiButtonRoundSmall.vue";

import BillButton from "./BillButton.vue";

import isEmpty from "lodash/isEmpty";
import _get from "lodash/get";
import _set from "lodash/set";
import find from "lodash/find";
import pickBy from "lodash/pickBy";
import cloneDeep from "lodash/cloneDeep";

@Component({
  components: {
    AiDialog,
    AiInput,
    AiInputCheck,
    AiInputRadio,
    AiSelection,
    AiButtonRoundSmall,
    BillButton,
  },
})
export default class Home extends Mixins(SyncMixin) {
  @Prop({ type: Boolean, default: false }) value: boolean;
  @Prop({ type: Object, default: () => ({}) }) project: any;
  @Prop({ type: Boolean, default: false }) trigger: boolean;
  @Prop({ type: Boolean, default: false }) isEnabledBalance: boolean;
  @Prop({ type: Number, default: 0 }) balance: number;
  @Prop({ type: Number, default: 0 }) originBalance: number;
  @Prop({ type: Object, default: null }) target: any;
  @Prop({ type: String, default: "" }) remark: string;

  method: string = "new";
  originTarget: any = null;
  isFromSelected: boolean = false;
  innerTarget: any = null;
  merchants: any = null;

  get isOriginTarget() {
    return this.originTarget && this.originTarget.id;
  }

  get isRechargeAi() {
    return _get(this.project, "channel.code") === "RechargeAi";
  }

  created() {
    this.loadRelatedMerchants();
    this.resetOriginTarget();
  }

  @Watch("target")
  onTargetChanged() {
    this.resetOriginTarget();
  }

  resetOriginTarget() {
    if (this.isFromSelected) return;

    this.originTarget =
      this.target && find(this.merchants, { id: this.target.id });
    this.innerTarget = this.originTarget || {};
  }

  onMethodChange(v) {
    this.method = v;

    if (this.method === "select") {
      this.isFromSelected = true;
      this.onSelected(this.innerTarget);
    } else {
      this.onSelected(this.originTarget);
    }
  }

  loadRelatedMerchants() {
    this.loadList({
      reset: true,
      store: "merchant",
      query: {
        user_id: this.$auth.user.id,
        extras: "logo_url",
        sort: "id desc",
      },
      success: (resp) => {
        this.merchants = cloneDeep(resp.data.data);
        this.resetOriginTarget();
      },
    });
  }

  onSelected(target) {
    if (!target) return;
    this.innerTarget = target;

    if (this.isFromSelected) {
      this.$emit("update:target", cloneDeep(this.innerTarget));
    }
  }

  buy() {
    let next: any = this.$route.query.next;
    if (!this.isRechargeAi || next) {
      this.$emit("submit", next);
      return;
    }

    if (this.method === "new") {
      next = this.$router.buildNext({
        name: "merchantAdd",
        query: {
          onlyNew: "true",
        },
      });
    }

    if (this.method === "select") {
      if (!this.innerTarget || this.innerTarget.id <= 0) {
        this.$hui.toast.error("请选择充值的目标学校");
        return;
      }

      next = this.$router.buildNext({
        name: "merchantProfile",
        query: {
          merchantId: this.innerTarget.id,
        },
      });
    }

    if (this.isOriginTarget) {
      next = this.$router.buildNext({
        name: "merchantProfile",
        query: {
          merchantId: this.innerTarget.id,
        },
      });
    }

    this.$emit("submit", next);
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

    .recharge-ai {
      margin: 10px auto;
      padding: 0px 30px;

      .origin-target {
        text-align: center;
        font-size: 13px;
        line-height: 1;

        span {
          font-size: 24px;
          font-weight: 800;
        }
      }

      .choice {
        margin: 15px 0px;
      }

      .selected {
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
