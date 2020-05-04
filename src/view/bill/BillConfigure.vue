<template>
  <div class="wrapper">
    <div class="decorator" />
    <div class="container">
      <div class="payment" v-if="!isWelfare">
        <div class="payment-title">
          指定可选套餐
        </div>
        <ai-list-stored
          resource="billItem"
          :query="query"
          :enableScroll="false"
          :enableEmpty="false"
        >
          <template v-slot:item="{ item }">
            <bill-card-payment
              :key="item.id"
              :item="item"
              :swiperEnable="false"
              :enableCheck="true"
              :checked="checkPayItem(item)"
              @update:checked="(checked) => setPayItem(item, checked)"
              class="item"
            />
          </template>
          <template v-slot:empty />
        </ai-list-stored>
      </div>
      <div class="welfare" v-else>
        <div class="welfare-title">
          指定可选套餐
        </div>
        <ai-list-stored
          resource="billItem"
          :query="query"
          :enableScroll="false"
          :enableEmpty="false"
        >
          <template v-slot:item="{ item }">
            <bill-card-welfare
              :key="item.id"
              :item="item"
              :swiperEnable="false"
              :checked="checkWelfareItem(item)"
              :enableCheck="true"
              @update:checked="(checked) => setWelfareItem(item, checked)"
              class="item"
            />
          </template>
          <template v-slot:empty />
        </ai-list-stored>
      </div>
      <div class="actions">
        <hui-button class="btn btn-cancel" @click.native="onCancel">
          取消
        </hui-button>
        <hui-button class="btn btn-submit" @click.native="onSubmit">
          确认
        </hui-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";

import AiListStored from "@/view/component/AiListStored.vue";

import BillCardWelfare from "./component/BillCardWelfare.vue";
import BillCardPayment from "./component/BillCardPayment.vue";

import split from "lodash/split";
import map from "lodash/map";
import filter from "lodash/filter";
import isEqual from "lodash/isEqual";
import _get from "lodash/get";
import concat from "lodash/concat";
import pullAll from "lodash/pullAll";
import indexOf from "lodash/indexOf";

@Component({
  components: {
    AiListStored,
    BillCardWelfare,
    BillCardPayment,
  },
})
export default class Home extends Vue {
  merchantId: number = null;
  projectId: number = null;
  sellerOpenid: string = null;
  payIds: any = [];
  welfareIds: any = [];

  get isWelfare() {
    return this.$route.query.type === "welfare";
  }

  get query() {
    return {
      merchant_id: this.merchantId,
      project_id: this.projectId,
      is_welfare: this.isWelfare,
      sort: "price asc",
    };
  }

  get isManager() {
    let user = this.$auth.user;
    if (!user) return false;

    return isEqual(user.curr_merch_id, this.merchantId) && user.is_manager;
  }

  created() {
    this.parseURL();
  }

  @Watch("isManager")
  onIsManagerChanged() {
    if (!this.isManager) {
      this.$router.push({
        name: "bill",
      });
    }
  }

  @Watch("$route", { deep: true })
  onRouteChanged() {
    this.parseURL();
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
  }

  onCancel() {
    this.$router.go(-1);
  }

  onSubmit() {
    let billPkgs = this.$auth.bill;
    let items = this.payIds.join("-") + "--" + this.welfareIds.join("-");

    billPkgs[`project_${this.projectId}`] = {
      pay: this.payIds,
      welfare: this.welfareIds,
      items: items,
    };
    this.$auth.bill = billPkgs;

    this.$router.push({
      name: "bill",
      params: {
        items: items,
      },
    });
  }

  checkPayItem(item) {
    return indexOf(this.payIds, item.id) >= 0;
  }

  setPayItem(item, checked) {
    this.payIds = checked
      ? concat(this.payIds, [item.id])
      : pullAll(this.payIds, [item.id]);
  }

  checkWelfareItem(item) {
    return indexOf(this.welfareIds, item.id) >= 0;
  }

  setWelfareItem(item, checked) {
    this.welfareIds = checked
      ? concat(this.welfareIds, [item.id])
      : pullAll(this.welfareIds, [item.id]);
  }
}
</script>
<style lang="scss" scoped>
.wrapper {
  position: relative;
  min-height: 100vh;
  overflow: hidden;

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

    padding: 20px;

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;

      margin: 10px 10px;

      .left {
        img {
          width: 16px;
        }
        span {
          font-size: 14px;
          font-weight: 500;
          color: rgba(88, 60, 41, 1);
          line-height: 18px;
          letter-spacing: 1px;
        }
      }
      .right {
      }
    }

    .item {
      margin: 10px 0px;
    }

    .payment {
      min-height: 70vh;

      &-title {
        height: 25px;
        font-size: 18px;
        font-weight: 600;
        color: rgba(255, 255, 255, 1);
        line-height: 25px;
        text-shadow: 0px 4px 5px rgba(255, 103, 6, 0.57);
        margin-top: 30px;
        margin-bottom: 10px;
      }
    }

    .welfare {
      min-height: 80vh;

      &-title {
        height: 25px;
        font-size: 18px;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: rgba(255, 255, 255, 1);
        line-height: 25px;
        text-shadow: 0px 4px 5px rgba(255, 103, 6, 0.57);
        margin-top: 30px;
        margin-bottom: 10px;
      }
    }
    .actions {
      display: flex;
      align-items: center;
      justify-content: space-around;

      .btn {
        width: 40%;
        height: 52px;
        background: rgba(255, 255, 255, 0.4);
        box-shadow: 0px 14px 10px -8px rgba(255, 104, 6, 0.45);
        border-radius: 26px;
        border: none;

        font-size: 16px;
        font-weight: bold;
        color: rgba(255, 255, 255, 1);
        line-height: 21px;
        letter-spacing: 1px;

        .btn-submit {
          background: linear-gradient(
            140deg,
            rgba(255, 176, 22, 1) 0%,
            rgba(255, 160, 28, 1) 100%
          );
          box-shadow: 0px 14px 10px -8px rgba(255, 104, 6, 0.45);
          border-radius: 26px;
        }
      }
    }
  }
}
</style>
