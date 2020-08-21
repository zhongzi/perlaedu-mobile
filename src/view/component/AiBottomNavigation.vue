<template>
  <ai-fixed-footer :class="b()">
    <slot name="header" />
    <div v-if="menus" :class="b('menus')" :style="cusStyle">
      <div
        v-for="(menu, index) in menus"
        :class="[b('menu'), { [b('menu-active')]: curMenu === menu }]"
        @click="onClick(menu)"
        :key="index"
      >
        <i
          :class="['iconfont', 'icon-' + menu.icon]"
          :style="{ color: curMenu === menu ? activeColor : color }"
        />
        <span :style="{ color: curMenu === menu ? activeColor : color }">
          {{ menu.name }}
        </span>
      </div>
    </div>
  </ai-fixed-footer>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

import AiFixedFooter from "./AiFixedFooter.vue";

@Component({
  name: "ai-bottom-navigation",
  components: {
    AiFixedFooter,
  },
})
export default class Home extends Vue {
  @Prop({ type: Array, default: null }) menus: any;
  @Prop({ type: Number, default: 0 }) curIdx: number;
  @Prop({ type: Object, default: null }) cusStyle: any;
  @Prop({ type: String, default: 0 }) color: string;
  @Prop({ type: String, default: 0 }) activeColor: string;

  curMenu: any = null;

  created() {
    this.curMenu = this.menus[this.curIdx];
  }

  onClick(menu) {
    this.curMenu = menu;
    if (menu.route) {
      this.$router.push(menu.route);
    } else {
      this.$emit("click", this.curMenu);
    }
  }
}
</script>
<style lang="scss" scoped>
.ai-bottom-navigation {
  &__menus {
    display: flex;
    align-items: center;
    justify-content: space-around;

    width: 100%;
    height: 64px;
    border-radius: 16px 16px 0px 0px;
    background: rgba(255, 255, 255, 1);
  }

  &__menu {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    margin: 10px 0px;

    i {
      height: 20px;
      color: rgba(74, 74, 74, 0.4);
      margin-bottom: 5px;
    }

    span {
      font-size: 10px;
      font-weight: 400;
      color: rgba(74, 74, 74, 0.4);
      line-height: 14px;
    }
  }
  &__menu-active {
    i {
      font-weight: 800;
      color: rgba(117, 85, 254, 1);
    }

    span {
      color: rgba(74, 74, 74, 1);
    }
  }
}
</style>
