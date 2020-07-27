<template>
  <div class="wrapper">
    <hui-button
      type="primary"
      class="btn-verify"
      @click.native="showDialog = true"
    >
      {{ isStaff ? "确认核销" : "核销二维码" }}</hui-button
    >
    <hui-dialog v-model="showDialog">
      <div class="dialog">
        <template v-if="isStaff">
          <ai-input
            class="remark"
            label="核销备注"
            placeholder="请输入备注信息"
            v-model="remark"
          />
          <ai-submit-actions @cancel="onCancel" @submit="onSubmit" />
        </template>
        <template v-else>
          <img :src="qrcode" />
          <div>(保密)</div>
          <div>仅向工作人员出示本核销二维码</div>
        </template>
      </div>
    </hui-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Mixins } from "vue-property-decorator";

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
  @Prop({ type: Boolean, default: true }) isStaff: any;

  showDialog: boolean = false;
  remark: string = "";

  get qrcode() {
    return this.$tools.resolveQrcode(this.$router, {
      name: "billManagementCouponDetail",
      params: {
        couponId: this.id,
      },
    });
  }

  created() {
    this.store = "billCouponAction";
  }

  onCancel() {
    this.showDialog = false;
  }

  onSubmit() {
    if (isEmpty(this.remark)) {
      this.$hui.toast.info("核销备注不可为空");
      return;
    }

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
  height: 60px;

  font-size: 18px;
  font-weight: 600px;
}
.dialog {
  padding: 20px;
  text-align: center;
  img {
    width: 100%;
  }
  .remark {
    & ::v-deep .ai-input__label {
      margin: 30px auto;
    }
  }
}
</style>
