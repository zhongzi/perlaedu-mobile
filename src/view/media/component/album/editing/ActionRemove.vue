<template>
  <div class="wrapper action" @click="onClick">
    <i class="iconfont icon-shanchu" />
    <span> 删除 </span>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Mixins } from "vue-property-decorator";

import SyncMixin from "@/mixin/SyncMixin";

import isEmpty from "lodash/isEmpty";
import map from "lodash/map";

@Component
export default class Home extends Mixins(SyncMixin) {
  @Prop({ type: Array, default: null }) links: any;

  onClick() {
    this.$hui.confirm.show({
      title: "删除确认",
      message: "确认从当前相册删除所选对象?",
      confirmText: "确认",
      cancelText: "取消",
      onConfirm: () => {
        this.doRemove();
      },
      onCancel: () => {},
    });
  }

  doRemove() {
    this.saveEntity({
      store: "mediaLink",
      res: map(this.links, (link) => {
        return {
          is_deleted: true,
          delete_or_recover_at: new Date(),
          id: link.id,
        };
      }),
      success: () => {
        this.$emit("deleted");
      },
    });
  }
}
</script>
<style lang="scss" scoped></style>
