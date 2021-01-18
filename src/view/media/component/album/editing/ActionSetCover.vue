<template>
  <div
    :class="['wrapper', 'action', { 'action-disabled': !isEdiable }]"
    @click="onClick"
  >
    <i class="iconfont icon-album" />
    <span> 设为封面 </span>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Mixins } from "vue-property-decorator";

import SyncMixin from "@/mixin/SyncMixin";

import isEmpty from "lodash/isEmpty";

@Component
export default class Home extends Mixins(SyncMixin) {
  @Prop({ type: Array, default: null }) links: any;

  get isEdiable() {
    return this.links && this.links.length === 1;
  }

  onClick() {
    if (this.isEdiable) {
      this.saveEntity({
        store: "mediaLink",
        res: {
          id: this.links[0].id,
          is_cover: true,
        },
        success: () => {
          this.$emit("setted");
          this.$bus.$emit("album:cover:changed");
        },
      });
    }
  }
}
</script>
<style lang="scss" scoped></style>
