<template>
  <div class="wrapper action" @click.stop="onClick">
    <i :class="['iconfont', icon]" />
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
  @Prop({ type: String, default: "icon-zhiding-left" }) icon: string;

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
        this.$emit("refresh");
      },
    });
  }
}
</script>
<style lang="scss" scoped>
.action {
  i {
    font-size: 15px;
  }
}
</style>
