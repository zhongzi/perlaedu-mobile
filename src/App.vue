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
    <div class="copyright">
      <a href="http://www.jiaowu.ai">由AI教务提供技术支持 </a>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import TipShare from "@/component/tip-share.vue";

@Component({
  components: {
    TipShare
  }
})
export default class Home extends Vue {
  created() {
    console.log("App.vue");
  }
}
</script>

<style lang="scss">
@import "./asset/iconfont/iconfont.css";
@import "./asset/css/style.css";

html {
  overflow: scroll;
  -webkit-overflow-scrolling: touch;
}

#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  background: #f5f5f5;
  min-height: 100vh;

  .copyright {
    text-align: center;
    font-size: 12px;
    color: #747474;
    letter-spacing: 1.34px;
    padding-top: 10px;

    a {
      color: inherit;
    }
  }
}
</style>
