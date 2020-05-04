<template>
  <swipe-cell ref="swiper" :class="b()">
    <template slot="content">
      <slot />
    </template>
    <template v-if="enable">
      <hui-button
        :class="b('action')"
        v-for="(action, index) in innerOptions.actions"
        :key="index"
        :style="getBtnStyle(action)"
        @click.native.stop="onAction(action)"
      >
        {{ action.text }}
      </hui-button>
    </template>
    <span v-else />
  </swipe-cell>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import SwipeCell from "vue-swipe-cell";

import isEmpty from "lodash/isEmpty";

@Component({
  name: "ai-cell-swiper",
  components: {
    SwipeCell,
  },
})
export default class Home extends Vue {
  @Prop({ type: Object, default: () => ({}) }) options: any;
  @Prop({ type: Boolean, default: true }) enable: boolean;

  get innerOptions() {
    return isEmpty(this.options)
      ? {
          width: 90,
          actions: [
            {
              text: "编辑",
              backgroundColor: "#ecb276",
              event: "modify",
            },
            {
              text: "删除",
              backgroundColor: "#fd3d30",
              event: "delete",
              confirm: {
                title: "删除确认",
                message:
                  "您正在执行删除，一旦执行， 将不可撤回， 请谨慎选择! 是否继续本操作?",
              },
            },
          ],
        }
      : this.options;
  }

  getBtnStyle(action) {
    return {
      width: action.width || this.innerOptions.width,
      backgroundColor: action.backgroundColor,
    };
  }

  onActionDoEmit(action) {
    this.$emit(action.event);
    this.$emit("action", action.event);
    (this.$refs.swiper as any).initAllCell();
  }

  onAction(action) {
    if (!action.confirm) {
      this.onActionDoEmit(action);
      return;
    }

    this.$hui.confirm.show({
      title: action.confirm.title,
      message: action.confirm.message,
      confirmText: action.confirm.confirmText || "确认",
      cancelText: action.confirm.cancelText || "取消",
      onConfirm: () => {
        this.onActionDoEmit(action);
      },
    });
    return;
  }
}
</script>
<style lang="scss" scoped>
.ai-cell-swiper {
  border-radius: 8px;

  & ::v-deep a {
    border-bottom: 0px !important;
  }

  & ::v-deep .cell-content {
    padding: 0px !important;
  }

  &__action {
    border-radius: 0px;
  }
}
</style>
