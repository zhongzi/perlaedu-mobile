import { Component, Vue } from "vue-property-decorator";

@Component
export default class PayMixin extends Vue {
  gotoFlashTradePage(
    type: any,
    related: any,
    next: any = null,
    failure: any = null,
    cancel: any = null
  ) {
    next = this.$tools.resolveURL(this.$router, {
      name: "Subscription",
      query: {
        qrcode: related.scene_qrcode_url,
        next: next || location.href,
      },
    });
    if (related.pay_balance <= 0) {
      window.location.href = next;
      return;
    }
    this.$router.push({
      name: "FlashTrade",
      query: {
        type: type,
        related_id: related.id,
        next: next,
        failure: failure || location.href,
        cancel: cancel || location.href,
      },
    });
  }
}
