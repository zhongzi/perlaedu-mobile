import { Component, Vue } from "vue-property-decorator";

@Component
export default class PayMixin extends Vue {
  gotoFlashTradePage(
    type: any,
    order: any,
    next: any = null,
    failure: any = null,
    cancel: any = null
  ) {
    let defaultNext = this.$tools.resolveURL(this.$router, {
      name: "Subscription",
      query: {
        qrcode: order.scene_qrcode_url,
        next: location.href,
      },
    });
    if (order.pay_balance <= 0) {
      this.$router.pushRawNext({ next: next || defaultNext });
      return;
    }

    defaultNext = next || defaultNext;
    if (typeof defaultNext === "object" && defaultNext !== null) {
      defaultNext = this.$tools.resolveURL(this.$router, defaultNext);
    }

    this.$router.push({
      name: "FlashTrade",
      query: {
        type: type,
        related_id: order.id,
        next: defaultNext,
        failure: failure || location.href,
        cancel: cancel || location.href,
      },
    });
  }
}
