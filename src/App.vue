<template>
  <div id="app">
    <transition>
      <keep-alive>
        <router-view v-if="$route.meta.keepAlive"></router-view>
      </keep-alive>
    </transition>
    <transition>
      <router-view v-if="!$route.meta.keepAlive"></router-view>
    </transition>
    <ai-copyright />
    <ai-tip-share v-model="showTip" />
  </div>
</template>
<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";

import AiTipShare from "./view/component/AiTipShare.vue";
import AiCopyright from "@/view/component/AiCopyright.vue";

@Component({
  components: {
    AiTipShare,
    AiCopyright,
  },
})
export default class Home extends Vue {
  showTip: boolean = false;
  created() {
    this.$auth.entry = window.location.href;
    this.$bus.$on("config:share", this.configShare);
    this.$bus.$on("config:share:tip:show", () => {
      this.showTip = true;
    });
  }

  configShare({ title, desc, link, imgUrl, success }) {
    imgUrl = this.$options.filters.alioss(
      imgUrl || "https://files.perlaedu.com/merchant/logo.bg.png"
    );

    console.log(title, desc, link, imgUrl);

    this.$weixin.config(() => {
      this.$weixin.configShare({
        title: title,
        desc: desc,
        link: link || window.location.href,
        imgUrl: imgUrl,
        success: () => {
          success && success();
        },
      });
    });
  }
}
</script>

<style lang="scss">
@import "./asset/iconfont/iconfont.css";
@import "./asset/css/style.css";
@import "./asset/css/normalize.css";

:root {
  box-sizing: border-box;
}

*,
::before,
::after {
  box-sizing: inherit;
  margin: 0;
  padding: 0;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
}

a {
  text-decoration: none;
}

#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  background: #f5f5f5;
  min-height: 100vh;
}
</style>
