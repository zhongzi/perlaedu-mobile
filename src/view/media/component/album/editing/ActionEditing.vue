<template>
  <div
    :class="['wrapper', 'action', { 'action-disabled': !isEdiable }]"
    @click="gotoEditing"
  >
    <i class="iconfont icon-editing" />
    <span> 编辑 </span>
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

  gotoEditing() {
    if (this.isEdiable) {
      this.$router.push({
        name: "mediaPhotoEditing",
        params: {
          mediaId: this.links[0].media_id,
        },
      });
    }
  }
}
</script>
<style lang="scss" scoped></style>
