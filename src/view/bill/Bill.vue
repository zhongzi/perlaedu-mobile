<template>
  <div class="wrapper">
    <div class="decorator" />
    <div class="container">
      <div class="header">
        <div class="left">
          <img
            :src="
              $options.filters.safe(
                project,
                'merchant.cover',
                require('@/asset/logo.png')
              )
            "
          />
          <span>{{ project | safe("merchant.name") }} </span>
        </div>
        <div class="right">
          <btn-call-manager />
        </div>
      </div>
      <div class="main">
        <div class="payment">
          <div class="payment-title">
            {{ project.title }}
          </div>
          <template v-for="item in payItems">
            <bill-card-payment
              :key="item.id"
              :item="item"
              :swiperEnable="false"
              :enableCheck="true"
              :panelOpened="true"
              :checked="selectedPayItemId === item.id"
              @update:checked="(checked) => setSelectedPayItemId(item, checked)"
              class="item"
            />
          </template>
          <div
            class="payment-btn-add"
            @click="gotoConfigurePage()"
            v-if="isManager"
          >
            <img :src="addBtnImage" />
          </div>
        </div>
        <div class="welfare" v-if="welfareItems.length > 0 || isManager">
          <div class="welfare-title">
            限时福利
          </div>
          <template v-for="item in welfareItems">
            <bill-card-welfare
              :key="item.id"
              :item="item"
              :payItem="selectedPayItem"
              :order="getOrderItem(item)"
              :swiperEnable="false"
              :checked="checkInWelfareIds(item)"
              @switch-status="onSwitchStatus"
              class="item"
            />
          </template>
          <div
            class="welfare-btn-add"
            @click="gotoConfigurePage('welfare')"
            v-if="isManager"
          >
            <img :src="addBtnImage" />
          </div>
        </div>
      </div>
      <ai-input-check v-model="checked" class="service-link">
        <router-link to="/terms-of-service/bill" class="service-link-text">
          我已经阅读并同意服务条款
        </router-link>
      </ai-input-check>
      <ai-copyright :manual="true" class="copyright" />
      <bill-actions
        :project="project"
        :order="order"
        :payBalance="payBalance"
        :isManager="isManager"
        :checked="checked"
        class="actions"
      />
    </div>
    <bill-pick-dialog
      :isManager="isManager"
      :items="welfareItems"
      :pickedItems="pickedItems"
      @picked="(val) => (selectedWelfareItemIds = val)"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Mixins } from "vue-property-decorator";

import SyncMixin from "@/mixin/SyncMixin";

import AiCopyright from "@/view/component/AiCopyright.vue";
import AiInputCheck from "@/view/component/AiInputCheck.vue";

import BillCardWelfare from "./component/BillCardWelfare.vue";
import BillCardPayment from "./component/BillCardPayment.vue";
import BtnGotoManagement from "./component/BtnGotoManagement.vue";
import BtnCallManager from "./component/BtnCallManager.vue";
import BillActions from "./component/BillActions.vue";
import BillPickDialog from "./BillPickDialog.vue";

import split from "lodash/split";
import map from "lodash/map";
import filter from "lodash/filter";
import isEqual from "lodash/isEqual";
import isEmpty from "lodash/isEmpty";
import _get from "lodash/get";
import concat from "lodash/concat";
import indexOf from "lodash/indexOf";
import find from "lodash/find";
import sortBy from "lodash/sortBy";
import reverse from "lodash/reverse";
import sumBy from "lodash/sumBy";
import remove from "lodash/remove";

@Component({
  components: {
    AiCopyright,
    AiInputCheck,
    BillCardWelfare,
    BillCardPayment,
    BtnGotoManagement,
    BtnCallManager,
    BillActions,
    BillPickDialog,
  },
})
export default class Home extends Mixins(SyncMixin) {
  merchantId: number = null;
  projectId: number = null;
  sellerOpenid: string = null;

  payIds: any = [];
  welfareIds: any = [];
  selectedPayItemId: number = null;
  selectedWelfareItemIds: any = [];

  checked: boolean = true;
  welfareBalanceItems: any = [];

  get addBtnImage() {
    return require("@/asset/image/bill-add-item" + this.$densityStr + ".png");
  }

  get payBalance() {
    let balance =
      (this.selectedPayItem.price || 0) -
      (sumBy(this.welfareBalanceItems, "price") || 0);
    return balance > 0 ? balance : 0;
  }

  get pickedItems() {
    const ret = filter(this.welfareItems, (item) =>
      find(this.payingOrderitems, (orderItem) => orderItem.item_id === item.id)
    );
    return ret;
  }

  get payingOrderitems() {
    return _get(this.project, "paying_order.items", []);
  }

  get selectedPayItem() {
    return (
      find(this.payItems, (item) => item.id === this.selectedPayItemId) || {}
    );
  }

  get payItems() {
    return sortBy(
      filter(this.project.items, (item) => {
        return !item.is_welfare && indexOf(this.payIds, item.id) >= 0;
      }),
      ["price"]
    );
  }

  get welfareItems() {
    return reverse(
      sortBy(
        filter(this.project.items, (item) => {
          return item.is_welfare && indexOf(this.welfareIds, item.id) >= 0;
        }),
        ["price"]
      )
    );
  }

  get order() {
    return {
      id: _get(this.project, "paying_order.id"),
      merchant_id: this.project.merchant_id,
      project_id: this.project.id,
      seller_openid: this.sellerOpenid,
      referrer_openid: this.$store.state.expose2,
      remark: _get(this.project, "paying_order.remark", ""),
      items: concat([this.selectedPayItemId], this.selectedWelfareItemIds),
    };
  }

  get project() {
    return this.entity;
  }

  get isManager() {
    return (
      isEqual(_get(this.$auth, "user.curr_merch_id"), this.merchantId) &&
      _get(this.$auth, "user.is_manager")
    );
  }

  created() {
    this.store = "billProject";

    this.parseURL();
    this.loadProject();
  }

  @Watch("$route", { deep: true })
  onRouteChanged() {
    this.parseURL();
    this.loadProject();
  }

  @Watch("project", { deep: true })
  onProjectChanged() {
    if (isEmpty(this.project)) return;

    this.configShare();
    this.parseURL();

    // 恢复所选套餐
    if (this.project.paying_order) {
      let items = filter(this.payingOrderitems, { is_welfare: false });
      this.selectedPayItemId = !isEmpty(items)
        ? items[0].item_id
        : this.selectedPayItemId;
    }

    // 判断本次恢复是否存在于可选套餐中
    if (
      this.selectedPayItemId &&
      !find(this.payItems, (item) => item.id === this.selectedPayItemId)
    ) {
      this.selectedPayItemId = null;
    }

    // 设置默认选择
    if (!this.selectedPayItemId) {
      this.selectedPayItemId = isEmpty(this.payItems)
        ? null
        : this.payItems[0].id;
    }
  }

  onSwitchStatus(item) {
    remove(this.welfareBalanceItems, (wi) => {
      return wi.id === item.id;
    });

    this.welfareBalanceItems = concat(this.welfareBalanceItems, item);
  }

  loadProject() {
    this.id = this.projectId;
    this.loadEntity({
      query: {
        merchant_id: this.merchantId,
        extras: JSON.stringify({
          BillProject: ["merchant", "paying_order", "items"],
          BillOrder: ["items"],
          BillOrderItem: ["is_valid"],
        }),
      },
    });
  }

  parseURL() {
    this.merchantId = parseInt(this.$route.params.merchantId as string);
    this.projectId = parseInt(this.$route.params.projectId as string);
    this.sellerOpenid = this.$route.params.openid;

    let idsArray = split(this.$route.params.items, "--");
    if (idsArray.length > 0) {
      this.payIds = filter(
        map(split(idsArray[0], "-"), (i) => parseInt(i) || 0),
        (o) => o > 0
      );
    }
    if (idsArray.length > 1) {
      this.welfareIds = filter(
        map(split(idsArray[1], "-"), (i) => parseInt(i) || 0),
        (o) => o > 0
      );
    }

    this.reloadFromLocal();
  }

  setSelectedPayItemId(item, checked) {
    this.selectedPayItemId = checked ? item.id : null;
    this.$forceUpdate();
  }

  checkInWelfareIds(item) {
    return indexOf(this.selectedWelfareItemIds, item.id) >= 0;
  }

  getOrderItem(item) {
    return find(this.payingOrderitems, { item_id: item.id });
  }

  gotoConfigurePage(type = "pay") {
    this.$router.push({
      name: "billConfigure",
      params: this.$route.params,
      query: {
        type: type,
      },
    });
  }

  configShare() {
    this.$store.commit("updateTitle", this.project.title);

    this.$bus.$emit("config:share", {
      title: _get(this.project, "merchant.name") + " - 专属支付通道",
      desc: this.project.title,
      imgUrl: _get(this.project, "merchant.logo_url"),
    });
  }

  reloadFromLocal() {
    let billPkgs = this.$auth.bill;
    let pkgs = billPkgs[`project_${this.projectId}`] || {};

    if (this.$route.params.items !== "new" && this.$route.params.items !== "--")
      return;

    let items = pkgs && pkgs.items;
    if (!items && !isEmpty(this.project)) {
      items = map(filter(this.project.items, { is_welfare: false }), "id").join(
        "-"
      );
      items += "--";
      items += map(filter(this.project.items, { is_welfare: true }), "id").join(
        "-"
      );
    }

    items &&
      this.$router.replace({
        name: "bill",
        params: {
          items: items,
        },
      });
  }
}
</script>
<style lang="scss" scoped>
.wrapper {
  position: relative;
  overflow: hidden;
  min-height: 100vh;

  background: linear-gradient(
    123deg,
    rgba(255, 207, 51, 1) 0%,
    rgba(255, 131, 6, 1) 100%
  );

  .decorator {
    position: absolute;
    top: 40px;
    right: -50px;

    width: 136px;
    height: 180px;
    transform: rotate(35deg);

    background: linear-gradient(
      234deg,
      rgba(255, 160, 47, 1) 0%,
      rgba(255, 189, 38, 1) 100%
    );
    border-radius: 24px;
  }

  .container {
    position: relative;

    padding: 20px 20px 0px 20px;
    margin-bottom: 80px;

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .left {
        display: flex;
        align-items: center;

        img {
          width: 16px;
          margin-right: 5px;
        }
        span {
          font-size: 14px;
          font-weight: 500;
          color: rgba(88, 60, 41, 1);
          letter-spacing: 1px;
        }
      }
      .right {
      }
    }

    .item {
      margin: 10px 0px;
    }

    .main {
      min-height: 70vh;
      margin-top: 15px;

      .payment {
        &-title {
          height: 25px;
          font-size: 18px;
          font-weight: 600;
          color: rgba(255, 255, 255, 1);
          line-height: 25px;
          text-shadow: 0px 4px 5px rgba(255, 103, 6, 0.57);
          margin-bottom: 10px;
        }

        &-btn-add {
          text-align: center;
          img {
            width: 80%;
          }
        }
      }

      .welfare {
        margin-top: 20px;

        &-title {
          height: 25px;
          font-size: 18px;
          font-family: PingFangSC-Semibold, PingFang SC;
          font-weight: 600;
          color: rgba(255, 255, 255, 1);
          line-height: 25px;
          text-shadow: 0px 4px 5px rgba(255, 103, 6, 0.57);
          margin-bottom: 10px;
        }

        &-btn-add {
          text-align: center;
          img {
            width: 80%;
          }
        }
      }
    }
  }
  .copyright {
    & ::v-deep a {
      color: #fff !important;
    }
  }
  .service-link {
    justify-content: center;
    margin: 10px 0px;

    &-text {
      font-size: 14px;
      font-weight: bold;
      color: rgba(255, 255, 255, 1);
      line-height: 16px;
      letter-spacing: 1px;
      text-decoration: none;
    }
  }
  .actions {
    margin-top: 20px;
    position: fixed;
    left: 0px;
    right: 0px;
    bottom: 10px;
  }
}
</style>
