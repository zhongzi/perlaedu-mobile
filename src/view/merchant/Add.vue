<template>
  <div class="wrapper phone-verifying">
    <ly-detail>
      <template v-slot:header>
        <img :src="merchantLogo" class="logo" />
        <div class="name">{{ merchantName }}</div>
      </template>
      <template>
        <div class="body">
          <div class="info">
            <div class="title">注册学校</div>
            <div class="remark" v-if="showRemark">{{ remark }}</div>
          </div>
          <ai-line />
          <template v-if="hasRelatedMerchants && !isOnlyNew">
            <div class="input-group merchant" @click="method = 'new'">
              <ai-input-radio
                value="new"
                :checked="method === 'new'"
                @change="onMethodChanged"
                title="注册一个新学校"
              />
              <ai-input
                v-model="name"
                mode="border-bottom"
                class="input"
                placeholder="请输入新学校名称"
              />
            </div>
            <div class="input-group merchant" @click="method = 'select'">
              <ai-input-radio
                value="select"
                :checked="method === 'select'"
                @change="onMethodChanged"
                title="为已注册学校付费"
              />
              <ai-selection
                :options="relatedMerchants"
                mode="border-bottom"
                valueKey="id"
                @selected="(v) => (merchant = v)"
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
            </div>
          </template>
          <template v-else>
            <div class="input-group merchant">
              <ai-input
                v-model="name"
                class="input"
                title="学校名称"
                placeholder="请输入学校名称"
              />
            </div>
          </template>
          <ai-submit-actions
            cancelLabel=""
            submitLabel="下一步"
            @submit="onNextStep"
          />
        </div>
      </template>
    </ly-detail>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Mixins, Watch } from "vue-property-decorator";

import SyncMixin from "@/mixin/SyncMixin";

import AiLine from "@/view/component/AiLine.vue";
import AiInput from "@/view/component/AiInput.vue";
import AiInputCheck from "@/view/component/AiInputCheck.vue";
import AiSubmitActions from "@/view/component/AiSubmitActions.vue";
import AiSelection from "@/view/component/AiSelection.vue";
import AiInputRadio from "@/view/component/AiInputRadio.vue";

import LyDetail from "@/view/layout/Detail.vue";

import _get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import cloneDeep from "lodash/cloneDeep";
import map from "lodash/map";

@Component({
  components: {
    AiLine,
    AiInput,
    AiInputCheck,
    AiSubmitActions,
    AiSelection,
    AiInputRadio,
    LyDetail,
  },
})
export default class Home extends Mixins(SyncMixin) {
  name: string = "";
  showRemark: boolean = false;
  relatedMerchants: any = null;

  method: string = "new";
  merchant: any = null;

  get isVerifiedPhone() {
    return _get(this.$auth, "user.phone_verified");
  }

  get isOnlyNew() {
    return !isEmpty(this.$route.query.onlyNew as any);
  }

  get hasRelatedMerchants() {
    return this.relatedMerchants && this.relatedMerchants.length > 0;
  }

  get billURL() {
    return this.$route.query.bill as any;
  }

  get cancelLabel() {
    return this.hasRelatedMerchants && !isEmpty(this.billURL)
      ? "给已注册机构充值"
      : "";
  }

  get merchantId() {
    return this.$route.query.merchantId || 0;
  }

  get merchantLogo() {
    if (!isEmpty(this.$route.query.logo)) {
      return this.$route.query.logo;
    }
    return require("@/asset/logo.bg.png");
  }

  get merchantName() {
    if (!isEmpty(this.$route.query.name)) {
      return this.$route.query.name;
    }
    return "Ai教务";
  }

  get remark() {
    if (isEmpty(this.relatedMerchants)) {
      return "注册在AI教务的第一个学校";
    }

    return `注册在AI教务的第 ${
      this.relatedMerchants.length + 1
    } 家学校，或为已注册的学校缴费`;
  }

  created() {
    this.requiredVerifiedPhone();
    this.loadRelatedMerchants();
    this.loadMerchant();
  }

  @Watch("merchantId")
  onMerchantIdChanged() {
    this.loadMerchant();
  }

  activated() {
    this.requiredVerifiedPhone();
  }

  onMethodChanged(v) {
    this.method = v;
  }

  loadMerchant() {
    const merchantId = parseInt(this.merchantId as any);
    if (merchantId <= 0) return;

    this.loadEntity({
      store: "merchant",
      id: merchantId,
      query: {
        extras: "logo_url",
      },
      success: (resp) => {
        this.merchant = resp.data;
      },
    });
  }

  requiredVerifiedPhone() {
    const query: any = {
      remark: "注册学校前需完成手机号码绑定",
    };
    if (this.$route.query.merchantId) {
      query.merchantId = this.$route.query.merchantId;
    }
    !this.isVerifiedPhone &&
      this.$router.replaceWithNext({
        name: "PhoneVerifying",
        query: query,
      });
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
        this.showRemark = true;
        this.relatedMerchants = cloneDeep(resp.data.data);
      },
    });
  }

  onNextStep() {
    if (this.method === "new") {
      this.addNewMerchant();
      return;
    }

    if (!this.merchant) return;
    this.onSelectedMerchant();
  }

  onSelectedMerchant() {
    // 继续完成付款开通操作
    const billOrderId = parseInt(this.$route.query.billOrderId as any);
    if (billOrderId && billOrderId > 0) {
      this.saveEntity({
        store: "billOrder",
        res: {
          id: billOrderId,
          target_id: this.merchant.id,
          target_class: "Merchant",
        },
        success: () => {
          this.$nextTick(() => {
            this.$auth.fetchLoggedUser(null, null, () => {
              this.gotoNext(this.merchant.id);
            });
          });
        },
        failure: (err) => {
          this.$hui.toast.error(err.response.data.message);
        },
      });
      return;
    }

    this.gotoNext(this.merchant.id);
  }

  addNewMerchant() {
    if (isEmpty(this.name)) {
      this.$hui.toast.error("请填写正确的机构名称");
      return;
    }

    const res: any = { name: this.name };

    // 来自收款服务需要自动关联自动核销
    const billOrderId = parseInt(this.$route.query.billOrderId as any);
    if (billOrderId && billOrderId > 0) {
      res.bill_order_id = billOrderId;
    }

    const agentId = parseInt(this.$route.query.agentId as any);
    if (agentId && agentId > 0) {
      res.agent_id = agentId;
    }

    this.saveEntity({
      store: "merchant",
      res: res,
      success: (resp) => {
        this.$nextTick(() => {
          this.$auth.fetchLoggedUser(null, null, () => {
            this.gotoNext(resp.data.id);
          });
        });
      },
      failure: (err) => {
        let msg = err.response.data.message;
        this.$hui.toast.error(msg === "资源冲突" ? "机构名称已被占用" : msg);
      },
    });
  }

  gotoNext(merchantId) {
    // next
    // bill
    // default -> merchantProfile
    if (!this.$router.pushNext({ current: this.$route })) {
      const nextRoute = {
        name: "merchantProfile",
        query: {
          merchantId,
        },
      };
      if (!isEmpty(this.billURL)) {
        const nextURL =
          this.billURL +
          (this.billURL.indexOf("?") >= 0 ? "&" : "?") +
          "merchantId=" +
          merchantId +
          "&next=" +
          encodeURIComponent(this.$router.buildNext(nextRoute) as any);
        window.location.href = nextURL;
      } else {
        this.$router.push(nextRoute);
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.phone-verifying {
  width: 100%;
  height: 100%;
  .logo {
    width: 70px;
    height: 70px;
    border-radius: 50%;
    box-shadow: 0px 0px 30px #ea8d0a;
  }
  .name {
    font-size: 18px;
    font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
    font-weight: bold;
    color: #ffffff;
    line-height: 31px;
    letter-spacing: 2px;
  }
  .body {
    padding: 10px;

    .message {
      min-height: 100px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      font-weight: 600;
      text-shadow: 2px 1px #000;
    }
    .info {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 10px;

      .title {
        font-size: 18px;
        font-weight: 600;
        color: #4a4a4a;
        line-height: 2;
      }
      .remark {
        font-size: 13px;
        color: #928e8e;
      }
    }
    .merchant {
      padding: 10px 30px;

      .service {
        padding-left: 10px;

        &-link {
          font-size: 14px;
          color: #000;
        }
      }
    }
  }
}
</style>
