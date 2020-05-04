<template>
  <div class="copyright" v-if="showCopyright" :style="copyrightStyle">
    <a href="http://www.jiaowu.ai">由AI教务提供技术支持 </a>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component
export default class Home extends Vue {
  @Prop({ type: Boolean, default: false }) manual: boolean;

  get showCopyright() {
    if (this.manual) return true;

    let hide = this.$route.meta.hideCopyright;
    if (!hide) {
      this.$route.matched.forEach((route: any) => {
        if (route.meta.hideCopyright) {
          hide = route.meta.hideCopyright;
        }
      });
    }
    return !hide;
  }

  get copyrightStyle() {
    let style = this.$route.meta.copyrightStyle || {};
    if (!style) {
      this.$route.matched.forEach((route: any) => {
        if (route.meta.copyrightStyle) {
          style = route.meta.copyrightStyle;
        }
      });
    }
    return style;
  }
}
</script>
