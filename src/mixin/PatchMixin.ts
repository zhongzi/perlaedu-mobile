import { Component, Vue } from "vue-property-decorator";

@Component
export default class SyncMixin extends Vue {
  get isIOS() {
    return /iphone|ipod|ios|ipad/.test(
      window.navigator.userAgent.toLowerCase()
    );
  }

  fixIOSScroll() {
    if (!this.isIOS) return;
    const scrollHeight =
      document.documentElement.scrollTop || document.body.scrollTop || 0;
    window.scrollTo(0, Math.max(scrollHeight - 1, 0));
    // 有些手机会有延迟，再做一次
    setTimeout(() => {
      window.scrollTo(0, Math.max(scrollHeight - 1, 0));
    }, 100);
  }
}
