<template>
  <div :class="size + ' check-box'" @click="switchActive">
    <div :class="checked ? 'ico checked' : 'ico'"></div>
    {{ text }}
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component
export default class Home extends Vue {
  @Prop({ type: String, default: null }) text: string;
  @Prop({ type: String, default: null }) size: string;
  @Prop({ type: Boolean, default: false }) checked: boolean;
  @Prop({ type: Boolean, default: false }) uncheckable: boolean;

  switchActive() {
    if (!this.uncheckable) {
      this.$emit("update:checked", !this.checked);
    }
  }
}
</script>
<style lang="scss" scoped>
.check-box {
  display: flex;
  align-items: center;
  color: #4a4a4a;
  font-size: 1.3rem;

  .ico {
    width: 1.7rem;
    height: 1.7rem;
    margin-right: 1rem;
    background: url("~@/asset/image/layout/icon_unselect_1.png") 0 0 no-repeat;
    background-size: 100% 100%;

    &.checked {
      background: url("~@/asset/image/layout/icon_selected_1.png") 0 0 no-repeat;
      background-size: 100% 100%;
    }
  }

  &.big {
    .ico {
      width: 2.4rem;
      height: 2.4rem;
      background: url("~@/asset/image/layout/icon_unselect.png") 0 0 no-repeat;
      background-size: 100% 100%;

      &.checked {
        background: url("~@/asset/image/layout/icon_selected.png") 0 0 no-repeat;
        background-size: 100% 100%;
      }
    }
  }
}
</style>
