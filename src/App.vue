<template>
  <div id="app">
    <transition>
      <router-view />
    </transition>
    <ai-copyright />
    <ai-tip-share v-model="showTip" />
    <ai-poster-popup
      v-if="showPoster"
      v-model="showPoster"
      :poster="poster"
      :context="posterContext"
    />
    <ai-popup
      v-model="showSharePopup"
      position="bottom"
      class="app-share-popup"
      :full="false"
    >
      <div class="popup">
        <div class="share" @click="onShowTip">
          <i class="iconfont icon-wechat" />
          <span> 分享给微信好友 </span>
        </div>
        <div class="poster" @click="onShowPoster" v-if="poster">
          <i class="iconfont icon-download-s" />
          <span> 生成海报 </span>
        </div>
      </div>
    </ai-popup>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";

import AiPopup from "@/view/component/AiPopup.vue";
import AiTipShare from "@/view/component/AiTipShare.vue";
import AiCopyright from "@/view/component/AiCopyright.vue";
import AiPosterPopup from "@/view/component/AiPosterPopup.vue";

@Component({
  components: {
    AiPopup,
    AiTipShare,
    AiCopyright,
    AiPosterPopup,
  },
})
export default class Home extends Vue {
  showSharePopup = false;
  showTip: boolean = false;
  showPoster: boolean = false;
  poster: any = {};
  posterContext: any = {};

  created() {
    this.$auth.entry = window.location.href;

    this.$bus.$on("config:share", this.configShare);
    this.$bus.$on("config:share:tip:show", () => {
      this.showTip = true;
    });

    this.$bus.$on("config:poster", this.configPoster);
    this.$bus.$on("config:poster:show", () => {
      this.showPoster = true;
    });

    this.$bus.$on("show:share:popup", () => {
      this.showSharePopup = true;
    });
  }

  configShare({ title, desc, link, imgUrl, success }) {
    imgUrl = this.$options.filters.alioss(
      imgUrl || "https://files.perlaedu.com/merchant/logo.bg.png",
      { width: 100, height: 100 }
    );

    this.$weixin.config(() => {
      this.$weixin.configShare({
        title: title,
        desc: desc,
        link: link || window.location.href,
        imgUrl: imgUrl,
        success: () => {
          this.defaultShareSuccess();
          success && success();
        },
      });
    });
  }

  configPoster(poster, context = null, show = false) {
    console.log(poster, context, show);
    this.poster = poster;
    this.posterContext = context;
    this.showPoster = show;
  }

  defaultShareSuccess() {
    this.$bus.$emit("count:share");
  }

  onShowTip() {
    this.showTip = true;
    this.showSharePopup = false;
  }

  onShowPoster() {
    this.showPoster = true;
    this.showSharePopup = false;
  }
}
</script>

<style lang="scss">
@import "~animate.css";
@import "./asset/css/reset.scss";
@import "./asset/css/layout/reset.scss";
@import "./asset/css/normalize.css";
@import "./asset/iconfont/iconfont.css";
@import "./asset/css/style.css";
@import "./asset/css/layout/ui.scss";

:root {
  box-sizing: border-box;
  background: #f5f5f5;
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
  min-height: 100vh;
}

.h-toast {
  z-index: 9999 !important;
}

.app-share-popup {
  .popup {
    min-height: 100px;
    padding: 20px;

    display: flex;
    align-items: center;
    justify-content: space-around;

    i {
      font-size: 40px;
      line-height: 1.5;
    }

    span {
      font-size: 13px;
    }

    .share {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      i {
        color: green;
      }
    }

    .poster {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      i {
        color: #ffb238;
      }
    }
  }
}
</style>
