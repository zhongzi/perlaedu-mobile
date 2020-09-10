<template>
  <hui-button @click.native="close">
    关闭线索
  </hui-button>
</template>

<script lang="ts">
import { Component, Vue, Prop, Mixins } from "vue-property-decorator";

import SyncMixin from "@/mixin/SyncMixin";

@Component
export default class Home extends Mixins(SyncMixin) {
  @Prop({ type: Object, default: null }) customer: any;

  created() {
    this.store = "crmCustomer";
  }

  close() {
    this.$hui.confirm.show({
      title: "关闭确认",
      message: `确定关闭当前线索`,
      confirmText: "确认",
      cancelText: "取消",
      onConfirm: () => {
        this.submit();
      },
    });
  }

  submit() {
    this.id = this.customer.id;
    this.saveEntity({
      res: {
        id: this.id,
        status: "finished",
      },
    });
  }
}
</script>
<style lang="scss" scoped></style>
