<template>
  <div class="wrapper pending">
    <ai-line-header title="激活进度" class="header" />
    <div class="progress">
      <span> {{ coupon.count_source }} </span> /
      <span> {{ coupon.count_source_on_links }}</span>
    </div>
    <div class="help">
      <div class="title">激活说明</div>
      <div class="rules">
        <div class="result">
          每获得 {{ coupon.links[0].unit }}张 {{ coupon.item.title }}, 需要:
        </div>
        <template v-for="link in coupon.links">
          <div class="rule" :key="link.id">
            - {{ link.is_refer ? "推荐好友" : "" }}
            {{ getAction(link).action || getAction(link).text }}
            {{ link.amount }}张
            {{ link.source.title }}
          </div>
        </template>
      </div>
      <hui-button type="primary" class="action" @click.native="takeAction">
        {{
          coupon.links[0].is_refer
            ? "送好友好课好礼，激活本券"
            : "马上去使用 " +
              (coupon.links.length === 1 ? coupon.links[0].source.title : "")
        }}</hui-button
      >
    </div>
    <div class="detail">
      <ai-line-header :title="detailTitle" class="header" />
      <div class="sources">
        <template v-for="source in coupon.sources">
          <ai-cell :key="source.id">
            <template v-slot:cover>
              <img :src="source | safe('source.user.avatar')" class="avatar" />
            </template>
            <template v-slot:title>
              <span class="title">
                {{ source | safe("source.user.nickname") }}
              </span>
            </template>
            <template v-slot:right>
              已领取
            </template>
          </ai-cell>
        </template>
      </div>
    </div>
    <hui-popup v-model="showPopup">
      <div class="popup">
        <div class="share" @click="showShareTip">
          <i class="iconfont icon-wechat" />
          <span> 分享给微信好友 </span>
        </div>
        <div class="poster" @click="showPosterClick" v-if="poster">
          <i class="iconfont icon-download-s" />
          <span> 生成海报 </span>
        </div>
      </div>
    </hui-popup>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";

import { BillCouponStatus } from "@/enum/bill_coupon_status";

import AiLineHeader from "@/view/component/AiLineHeader.vue";
import AiCell from "@/view/component/AiCell.vue";

import isEmpty from "lodash/isEmpty";
import _get from "lodash/get";

@Component({
  components: {
    AiLineHeader,
    AiCell,
  },
})
export default class Home extends Vue {
  @Prop({ type: Object, default: null }) coupon: any;
  @Prop({ type: Boolean, default: false }) isStaff: boolean;

  showPopup: boolean = false;

  get poster() {
    return _get(
      this.coupon,
      "item.share.poster",
      _get(this.coupon, "merchant.website.share.poster")
    );
  }

  get posterContext() {
    return {
      coupon: this.coupon,
      merchant: this.coupon.merchant,
      website: this.coupon.merchant.website,
      user: this.$auth.user,
      qrcode: this.$tools.makeQrcode(_get(this.poster, "link", this.shareLink)),
    };
  }

  get shareLink() {
    let link = _get(this.coupon, "share.url");
    if (isEmpty(link)) {
      if (this.coupon.merchant_id > 0) {
        link = this.$tools.resolveURL(this.$router, {
          name: "websiteMerchant",
          params: {
            merchantId: this.coupon.merchant_id,
          },
          query: {
            expose: this.$auth.openid,
          },
        });
      } else if (this.coupon.union_id > 0) {
        link = this.$tools.resolveURL(this.$router, {
          name: "websiteUnion",
          params: {
            unionId: this.coupon.union_id,
          },
          query: {
            expose: this.$auth.openid,
          },
        });
      }
    }
    return link;
  }

  get detailTitle() {
    if (this.coupon.count_source > 0) {
      return "已送给" + this.coupon.count_source + "位好友好课好礼";
    }
    return "暂无任何好友领取好课好礼";
  }

  created() {
    this.configShare();
  }

  @Watch("coupon", { deep: true })
  onCouponChanged() {
    this.configShare();
  }

  getAction(link) {
    return BillCouponStatus[link.stage];
  }

  showShareTip() {
    this.showPopup = false;
    this.$bus.$emit("config:share:tip:show");
  }

  showPosterClick() {
    this.showPopup = false;
    this.$bus.$emit("config:poster", this.poster, this.posterContext, true);
  }

  takeAction() {
    if (this.coupon.links[0].is_refer) {
      this.showPopup = true;
      return;
    }

    this.$router.push({
      name: "billProfileCoupons",
    });
  }

  configShare() {
    if (
      isEmpty(this.coupon.union) &&
      isEmpty(this.coupon.merchant) &&
      isEmpty(this.coupon.item.share)
    ) {
      return;
    }
    const title = _get(
      this.coupon.item,
      "share.title",
      `${this.$auth.user.nickname} 给你赠送一份 ${this.coupon.merchant.name} 的大礼包`
    );
    const desc = _get(
      this.coupon.item,
      "share.desc",
      "我已经成功领取，名额有限，快来抢！"
    );
    const imgUrl = _get(
      this.coupon.item,
      "share.imgUrl",
      this.coupon.merchant.cover_url || this.coupon.merchant.logo_url
    );

    this.$bus.$emit("config:share", {
      title,
      desc,
      imgUrl,
      link: this.shareLink,
    });
  }
}
</script>
<style lang="scss" scoped>
.pending {
  .progress {
    text-align: center;
    font-size: 24px;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    line-height: 2;
    span:nth-child(1) {
      font-size: 48px;
    }
  }
  .action {
    width: 100%;
    height: 40px;

    background: rgba(237, 139, 65, 1);
    border-radius: 3px;

    font-size: 16px;
    font-family: Helvetica;
    color: rgba(255, 255, 255, 1);
    line-height: 19px;
    letter-spacing: 1px;

    margin: 10px auto 50px;
  }

  .help {
    .title {
      font-size: 14px;
      font-family: Helvetica;
      color: rgba(84, 84, 84, 1);
      line-height: 2;
      letter-spacing: 1px;
    }
    .rules {
      font-size: 13px;
      font-family: Helvetica;
      color: rgba(165, 165, 165, 1);
      line-height: 16px;
      letter-spacing: 1px;
    }
  }
  .detail {
    min-height: 40px;

    .sources {
      .avatar {
        width: 28px;
        border-radius: 50%;
        margin-right: 10px;
      }
      .title {
        font-size: 14px;
        font-family: Helvetica;
        color: rgba(84, 84, 84, 1);
        line-height: 2;
        letter-spacing: 1px;
      }
    }
  }

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
