<template>
  <div class="wrapper action" @click="onClick">
    <i class="iconfont icon-shanchu" />
    <span> {{ isSelected ? "删除所选" : "清空回收站" }}</span>
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
  @Prop({ type: Number, default: null }) targetId: number;
  @Prop({ type: String, default: null }) targetClass: string;

  get isSelected() {
    return !isEmpty(this.links);
  }

  onClick() {
    const message = this.isSelected ? "所选择对象" : "全部对象";
    this.$hui.confirm.show({
      title: "删除确认",
      message: `确认从当前回收站删除${message}?`,
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
      query: {
        is_all_remove: !this.isSelected,
        target_id: this.targetId,
        target_class: this.targetClass,
      },
      res:
        this.isSelected &&
        map(this.links, (link) => {
          return {
            is_deleted: true,
            delete_or_recover_at: new Date(),
            id: link.id,
          };
        }),
      success: () => {
        this.$emit("finished");
      },
    });
  }
}
</script>
<style lang="scss" scoped></style>
