<template>
  <div class="wrapper cover">
    <hui-button v-if="!isCover" @click.native.stop="onClick" class="button">
      {{ isCover ? "封面" : "设为封面" }}
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
  @Prop({ type: Object, default: null }) album: any;
  @Prop({ type: Object, default: null }) photo: any;

  get isCover() {
    return isEqual(this.album.cover, this.photo.cover);
  }

  created() {
    this.store = "album";
  }

  onClick() {
    if (!this.album.id) return;

    this.id = this.album.id;
    this.saveEntity({
      res: {
        id: this.id,
        cover: this.photo.cover,
      },
      success: () => {
        this.$hui.toast.info("设置成功");
      },
    });
  }
}
</script>
<style lang="scss" scoped>
.cover {
  .button {
    float: right;
    padding: 5px;
    height: 30px;
    border: none;
  }
}
</style>
