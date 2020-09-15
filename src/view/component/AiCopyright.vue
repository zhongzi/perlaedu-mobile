<template>
  <div class="copyright" v-if="showCopyright" :style="copyrightStyle">
    <a :href="url">由AI教务提供技术支持 </a>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component
export default class Home extends Vue {
  @Prop({ type: Boolean, default: false }) manual: boolean;

  get url() {
    const expose = this.$store.state.expose;
    const expose2 = this.$store.state.expose2;
    const sourceId = this.$route.params.merchantId || "";
    const sourceClass = sourceId ? "Merchant" : "";
    return `${this.$configs.website}?code=${this.$configs.crmChannelCode}&sourceId=${sourceId}&sourceClass=${sourceClass}&expose=${expose}&expose2=${expose2}`;
  }

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
<style lang="scss" scoped>
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
</style>
