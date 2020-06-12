<template>
  <div :class="b()">
    <span :class="b('button')" @click.stop="onClick">
      <i class="iconfont icon-close-black" />
    </span>
    <slot />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({
  name: "ai-button-float-delete",
})
export default class Home extends Vue {
  onClick() {
    this.$hui.confirm.show({
      title: "删除确认",
      message: `您正在执行删除操作，该操作不可逆， 请谨慎操作！ 继续执行请确认`,
      confirmText: "确认",
      cancelText: "取消",
      onConfirm: () => {
        this.$emit("delete");
      },
    });
  }
}
</script>
<style lang="scss" scoped>
.ai-button-float-delete {
  margin: 10px 0px;

  position: relative;

  &__button {
    width: 18px;
    height: 18px;

    position: absolute;
    right: -9px;
    top: -9px;
    i {
      font-size: 24px;
    }
  }
}
</style>
