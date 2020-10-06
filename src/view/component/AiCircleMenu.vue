<template>
  <div :class="b()" :style="mergedStyle">
    <div class="center" :style="mergedCenterStyle">
      <slot />
    </div>
    <template v-for="(menu, index) in innerMenus">
      <div :key="index" :class="b('menu')" :style="menu.style">
        <div :style="menu.eleStyle">
          <slot name="item" :menu="menu" />
        </div>
      </div>
    </template>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

import merge from "lodash/merge";

@Component({
  name: "ai-circle-menu",
})
export default class Home extends Vue {
  @Prop({ type: Array, default: null }) menus: any;
  @Prop({ type: Number, default: 30 }) mRadius: number;
  @Prop({ type: Number, default: 60 }) cRadius: number;
  @Prop({ type: Number, default: 130 }) radius: number;

  get total() {
    return this.menus.length;
  }

  get innerMenus() {
    return this.menus
      ? this.menus.map((menu, index) => {
          return merge({}, menu, {
            style: {
              position: "absolute",
              zIndex: 2,
              left: "50%",
              top: 0,
              width: `${this.mRadius * 2}px`,
              height: `${this.mRadius * 2}px`,
              margin: `-${this.mRadius}px 0 0 -${this.mRadius}px`,
              transformOrigin: `${this.mRadius}px ${
                this.radius + this.mRadius
              }px`,
              transform: `rotate(${(360 / this.total) * index}deg)`,
            },
            eleStyle: {
              transform: `rotate(-${(360 / this.total) * index}deg)`,
            },
          });
        })
      : [];
  }

  get mergedStyle() {
    return {
      position: "relative",
      width: `${this.radius * 2}px`,
      height: `${this.radius * 2}px`,
      borderRadius: "50%",
      border: "3px dashed RGBA(255, 198, 178, 1)",
      margin: `${this.mRadius + 10}px auto`,
    };
  }

  get mergedCenterStyle() {
    return {
      width: `${this.cRadius * 2}px`,
      height: `${this.cRadius * 2}px`,
      borderRadius: "50%",
      overflow: "hidden",
    };
  }
}
</script>
<style lang="scss" scoped>
.ai-circle-menu {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
