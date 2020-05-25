<template>
  <div class="wrapper-dashboard">
    <div class="header">
      <bill-order
        :item="order"
        :isSimpleMode="true"
        class="item"
        v-if="order"
      />
    </div>
    <ai-list-stored
      resource="merchant"
      :query="query"
      :height="500"
      class="container"
    >
      <template v-slot:header>
        <div class="container-header">
          <ai-search v-model="keyword" placeholder="学校名称" />
          <hui-button @click.native="open = true">
            <i class="iconfont icon-plus" />
            学校
          </hui-button>
        </div>
      </template>
      <template v-slot:item="{ item }">
        <bill-merchant
          :key="item.id"
          :merchant="item"
          class="item"
          @click="addCost(item)"
        />
      </template>
    </ai-list-stored>
    <hui-dialog v-model="open" v-if="open">
      <merchant-form @success="addCost" @cancel="open = false" />
    </hui-dialog>
    <hui-dialog v-model="openRemark">
      <div class="remark">
        <ai-input
          v-model="remark"
          placeholder="核销备注(可选)"
          class="remark-input"
        />
        <ai-button-round @click.native="onSubmit"> 提交 </ai-button-round>
      </div>
    </hui-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Mixins } from "vue-property-decorator";

import SyncMixin from "@/mixin/SyncMixin";

import AiSearch from "@/view/component/AiSearch.vue";
import AiListStored from "@/view/component/AiListStored.vue";
import AiInput from "@/view/component/AiInput.vue";
import AiButtonRound from "@/view/component/AiButtonRound.vue";

import BillOrder from "../../component/BillOrder.vue";
import BillMerchant from "../../component/BillMerchant.vue";
import MerchantForm from "./MerchantForm.vue";

import _get from "lodash/get";
import isEmpty from "lodash/isEmpty";

@Component({
  components: {
    AiSearch,
    AiListStored,
    AiInput,
    AiButtonRound,
    BillMerchant,
    BillOrder,
    MerchantForm,
  },
})
export default class Home extends Mixins(SyncMixin) {
  open: boolean = false;
  keyword: string = "";
  order: any = null;
  openRemark: boolean = false;
  remark: string = "";
  curMerchant: any = null;

  get query() {
    return {
      agent_id: _get(this.$auth, "user.agent.id", ""),
      sort: "id desc",
      filters: JSON.stringify({
        name: [this.keyword],
      }),
    };
  }

  created() {
    this.store = "billOrderCost";

    this.loadEntityExtra({
      store: "billOrder",
      id: this.$route.params.orderId,
      query: {
        extras: JSON.stringify({
          BillOrder: [
            "vproject",
            "user",
            "seller",
            "items",
            "cost_items",
            "hashed_id",
          ],
          BillOrderItem: ["vitem"],
        }),
      },
      success: (resp) => {
        this.order = resp.data;
      },
    });
  }

  addCost(merchant) {
    this.open = false;
    this.$hui.confirm.show({
      title: "充值确认",
      message: `您正在给学校【${merchant.name}】充值${this.order.balance}元，请确认`,
      confirmText: "确认",
      cancelText: "取消",
      onConfirm: () => {
        this.curMerchant = merchant;
        this.openRemark = true;
      },
    });
  }

  onSubmit() {
    this.saveEntity({
      res: {
        order_id: this.order.id,
        balance: this.order.balance,
        pay_balance: this.order.pay_balance,
        value: this.order.value,
        target_id: this.curMerchant.id,
        target_class: "Merchant",
        remark: this.remark,
      },
      success: () => {
        this.$hui.toast.info("充值成功");
        this.$nextTick(() => {
          this.$router.push({
            name: "billManagementDashboard",
            query: {
              type: "used",
            },
          });
        });
      },
    });
    this.curMerchant = null;
    this.openRemark = false;
  }
}
</script>
<style lang="scss" scoped>
.wrapper-dashboard {
  width: 100%;
  .header {
    display: flex;
    align-items: center;
    justify-content: space-around;
    padding: 10px 10px;

    background: linear-gradient(
      119deg,
      rgba(255, 146, 73, 1) 0%,
      rgba(226, 99, 14, 1) 100%
    );
  }
  .container {
    min-height: 70vh;
    padding: 10px;

    &-header {
      display: flex;
      align-items: center;
      justify-content: space-around;
      margin-bottom: 10px;
    }

    .item {
      margin: 10px;
    }
  }
  .remark {
    padding: 50px;

    &-input {
      padding: 20px;
      margin-bottom: 20px;
    }
  }
}
</style>
