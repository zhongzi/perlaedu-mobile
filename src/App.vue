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
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

import AiTipShare from "./view/component/AiTipShare.vue";
import AiCopyright from "@/view/component/AiCopyright.vue";

@Component({
  components: {
    AiTipShare,
    AiCopyright,
  },
})
export default class Home extends Vue {
  created() {
    this.$auth.entry = window.location.href;
    this.$bus.$on("config:share", this.configShare);
  }

  configShare({ title, desc, link, imgUrl, success }) {
    imgUrl = this.$options.filters.alioss(imgUrl);

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

html,
body {
  overflow: scroll;
  width: 100%;
  height: 100%;
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

  .copyright {
    text-align: center;
    font-size: 12px;
    color: #747474;
    letter-spacing: 1.34px;
    padding: 10px 0px 20px;

    a {
      color: inherit;
    }
  }
}
</style>
