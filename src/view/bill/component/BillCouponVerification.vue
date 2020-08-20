<template>
  <div class="wrapper">
    <hui-button
      type="primary"
      class="btn-verify"
      @click.native="showDialog = true"
    >
      {{ isStaff ? "立即核销" : "立即使用" }}</hui-button
    >
    <hui-dialog v-model="showDialog">
      <div class="dialog">
        <template v-if="isStaff">
          <ai-input
            class="remark"
            label="核销备注"
            placeholder="请输入必要信息"
            v-model="remark"
          />
          <ai-submit-actions @cancel="onCancel" @submit="onSubmit" />
        </template>
        <template v-else>
          <img :src="qrcode" />
          <div>仅向工作人员出示本核销二维码</div>
        </template>
      </div>
      <div class="close" @click="showDialog = false">
        <i class="iconfont icon-close" />
      </div>
    </hui-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Mixins, Watch } from "vue-property-decorator";

import SyncMixin from "@/mixin/SyncMixin";

import AiInput from "@/view/component/AiInput.vue";
import AiSubmitActions from "@/view/component/AiSubmitActions.vue";

import isEmpty from "lodash/isEmpty";

@Component({
  components: {
    AiInput,
    AiSubmitActions,
  },
})
export default class Home extends Mixins(SyncMixin) {
  @Prop({ type: Object, default: null }) coupon: any;
  @Prop({ type: Boolean, default: false }) isStaff: any;

  showDialog: boolean = false;
  remark: string = "";

  get qrcode() {
    return this.$tools.resolveQrcode(this.$router, {
      name: "billManagementCouponDetail",
      params: {
        couponId: this.coupon.id,
      },
      query: {
        code: this.coupon.verification_code,
      },
    });
  }

  created() {
    this.store = "billCouponAction";
  }

  @Watch("showDialog")
  onShowDialogChanged() {
    this.showDialog && this.$bus.$emit("bill:coupon:refresh");
  }

  onCancel() {
    this.showDialog = false;
  }

  onSubmit() {
    this.save();
  }

  save() {
    this.saveEntity({
      res: {
        coupon_id: this.coupon.id,
        action: "used",
        verification_code: this.$route.query.code,
        remark: this.remark,
      },
      success: () => {
        this.showDialog = false;
        this.$bus.$emit("coupon:refresh");
        this.$hui.toast.info("核销成功");
      },
    });
  }
}
</script>
<style lang="scss" scoped>
.btn-verify {
  width: 100%;
  height: 40px;

  background: rgba(237, 139, 65, 1);
  border-radius: 3px;

  font-size: 16px;
  font-family: Helvetica;
  color: rgba(255, 255, 255, 1);
  line-height: 19px;
  letter-spacing: 1px;
}
.dialog {
  padding: 50px;
  text-align: center;

  img {
    width: 100%;
  }
  div {
    font-size: 12px;
    line-height: 1.5;
  }
  .remark {
    & ::v-deep .ai-input__label {
      margin: 30px auto;
    }
  }

  & ::v-deep .ai-submit-actions__action:nth-child(1) {
    display: none;
  }
}
.close {
  position: relative;
  text-align: center;
  bottom: -50px;
  i {
    padding: 10px;
    border: 1px solid #fff;
    border-radius: 50%;
    color: #fff;
  }
}
</style>
