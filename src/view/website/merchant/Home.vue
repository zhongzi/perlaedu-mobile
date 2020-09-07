<template>
  <div class="wrapper">
    <router-view />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Mixins, Watch } from "vue-property-decorator";

import SyncMixin from "@/mixin/SyncMixin";

import countAPI from "@/api/common/count";
import { CountType } from "@/enum/count_type";

import isEmpty from "lodash/isEmpty";
import _get from "lodash/get";
import merge from "lodash/merge";

@Component
export default class Home extends Mixins(SyncMixin) {
  get merchant() {
    return this.entity;
  }

  get poster() {
    return _get(this.merchant, "website.share.poster");
  }

  get shareLink() {
    let link = _get(this.poster, "share.url");
    if (isEmpty(link)) {
      link = this.$tools.resolveURL(this.$router, {
        name: "websiteMerchant",
        params: {
          merchantId: this.merchant.id,
        },
        query: {
          expose: this.$auth.openid,
        },
      });
    }
    return link;
  }

  get posterContext() {
    return {
      merchant: this.merchant,
      website: this.merchant.website,
      user: this.$auth.user,
      qrcode: this.$tools.makeQrcode(_get(this.poster, "link", this.shareLink)),
    };
  }

  created() {
    this.store = "merchant";
    this.$bus.$on("count:share", this.countShare);

    this.$bus.$on("inner:config:poster", (poster, context, show) => {
      this.$bus.$emit(
        "config:poster",
        merge(this.poster, poster || {}),
        merge(this.posterContext, context || {}),
        show || true
      );
    });

    if (
      this.$route.params.merchantId === "myself" &&
      this.$auth.user.curr_merch_id
    ) {
      return this.$router.push({
        name: "websiteMerchant",
        params: {
          merchantId: this.$auth.user.curr_merch_id,
        },
      });
    }
    this.loadMerchant();
  }

  @Watch("merchant", { deep: true })
  onMerchantChanged() {
    this.share();
    this.view();
  }

  @Watch("$route", { deep: true })
  onRouteChanged() {
    this.loadMerchant();
  }

  loadMerchant() {
    this.id = this.$route.params.merchantId;

    this.loadEntity({
      requireColumns: ["count_persons"],
      query: {
        extras: JSON.stringify({
          Merchant: [
            "count_persons",
            "me",
            "location",
            "scene_qrcode_url",
            "union_merchant",
            "website",
            "coupon",
          ],
          Website: ["skin", "share"],
        }),
      },
      success: () => {
        this.checkWebsite();
      },
      failure: (e) => {
        if (e.response.status === 404) {
          this.checkWebsite();
          return;
        }
      },
    });
  }

  checkWebsite() {
    if (isEmpty(this.merchant) || isEmpty(this.merchant.website)) {
      this.$router.push({
        name: "newWebsiteGuide",
      });
    }
    if (this.merchant.website.status !== "approved") {
      this.$router.push({
        name: "websitePending",
      });
    }
  }

  share() {
    if (isEmpty(this.merchant)) return;

    const name = `${this.$auth.user.nickname} 给你推荐 ${this.merchant.name}`;
    this.$bus.$emit("config:share", {
      title: name,
      desc: "这是一家非常棒的培训机构哦， 快来了解",
      imgUrl: this.merchant.cover_url || this.merchant.logo_url,
    });
  }

  view() {
    if (isEmpty(this.merchant)) return;
    this.countView();

    this.$db.nsSet("websites", this.merchant.id, {
      date: new Date().getTime(),
    });
  }

  countView() {
    countAPI.list({
      query: {
        related_id: this.merchant.id,
        type_: CountType.merchant_pv.value,
        tag: this.$store.state.expose2,
        openid: this.$store.state.expose,
        referee: this.$store.state.expose2,
      },
      headers: {},
      args: {},
    });
  }

  countShare() {
    countAPI.list({
      query: {
        related_id: this.merchant.id,
        type_: CountType.merchant_ps.value,
        tag: this.$store.state.expose2,
        openid: this.$store.state.expose,
        referee: this.$store.state.expose2,
      },
      headers: {},
      args: {},
    });
  }
}
</script>
