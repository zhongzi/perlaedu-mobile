<template>
  <div class="wrapper action">
    <hui-button @click.native.stop="onClick" class="button">
      置顶
    </hui-button>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Mixins } from "vue-property-decorator";

import SyncMixin from "@/mixin/SyncMixin";

import isEqual from "lodash/isEqual";
import isEmpty from "lodash/isEmpty";

@Component
export default class Home extends Mixins(SyncMixin) {
  @Prop({ type: String, default: null }) resource: string;
  @Prop({ type: Object, default: null }) target: any;

  created() {
    this.store = this.resource;
  }

  onClick() {
    if (isEmpty(this.target) || !this.target.id) return;

    this.id = this.target.id;
    this.saveEntity({
      res: {
        id: this.id,
        sequence: new Date().getTime(),
      },
      success: () => {
        this.$hui.toast.info("设置成功");
        this.$emit("refresh");
      },
    });
  }
}
</script>
<style lang="scss" scoped>
.action {
}
</style>
