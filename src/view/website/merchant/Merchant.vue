<template>
  <div class="wrapper website">
    <div class="cover">
      <img :src="merchant.cover_url | alioss({ width: 300, height: 200 })" />
      <div
        class="setting"
        v-if="isOwner"
        @click="$router.push({ name: 'websiteEditing' })"
      >
        <i class="iconfont icon-setting" />
      </div>
    </div>
    <div class="content" :style="mergedStyle">
      <div class="block">
        <merchant :merchant="merchant" />
        <div class="section unions">
          <union-list :query="query" :merchant="merchant" />
        </div>
        <div class="section coupons" v-if="website.coupon_enabled">
          <coupon-list :query="query" :merchant="merchant" />
        </div>
      </div>
      <div class="section campaigns">
        <campaign-list :query="query" />
      </div>
      <div class="section courses">
        <course-list :query="query" />
      </div>
      <div class="section teachers">
        <teacher-list :query="query" />
      </div>
      <div class="section albums">
        <album-list :query="query" />
      </div>
      <div class="section videos">
        <video-list :query="query" />
      </div>
      <div class="section articles">
        <article-list :query="query" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Mixins } from "vue-property-decorator";

import SyncMixin from "@/mixin/SyncMixin";

import Merchant from "../component/Merchant.vue";
import UnionList from "../component/UnionList.vue";
import CouponList from "../component/CouponList.vue";
import CampaignList from "../component/CampaignList.vue";
import CourseList from "../component/CourseList.vue";
import TeacherList from "../component/TeacherList.vue";
import AlbumList from "../component/AlbumList.vue";
import VideoList from "../component/VideoList.vue";
import ArticleList from "../component/ArticleList.vue";

import isEqual from "lodash/isEqual";
import _get from "lodash/get";
import merge from "lodash/merge";
import isEmpty from "lodash/isEmpty";
import startsWith from "lodash/startsWith";

@Component({
  components: {
    Merchant,
    UnionList,
    CouponList,
    CampaignList,
    CourseList,
    TeacherList,
    AlbumList,
    VideoList,
    ArticleList,
  },
})
export default class Home extends Mixins(SyncMixin) {
  get merchant() {
    return this.entity;
  }

  get isOwner() {
    return (
      this.merchant.id &&
      _get(this.$auth, "user.is_manager") &&
      isEqual(this.merchant.id, _get(this.$auth, "user.curr_merch_id"))
    );
  }

  get query() {
    return {
      merchant_id: this.$route.params.merchantId,
    };
  }

  get website() {
    return _get(this.merchant, "website") || {};
  }

  get bgCover() {
    return (
      this.website.cover_bg ||
      require("@/asset/image/default_website_bg" + this.$densityStr + ".png")
    );
  }

  get skin() {
    return this.website.skin || {};
  }

  get bgImage() {
    const img = this.skin.bgImage;
    return !isEmpty(img)
      ? startsWith(img, "linear")
        ? img
        : `url(${img})`
      : "";
  }

  get mergedStyle() {
    return merge(
      {
        backgroundImage: this.bgImage,
        backgroundRepeat: "repeat-y",
        backgroundPosition: "center top",
        backgroundSize: "contain",
      },
      this.skin.style || {}
    );
  }

  created() {
    this.store = "merchant";
    this.id = this.$route.params.merchantId;
  }

  @Watch("merchant", { deep: true })
  onMerchantChanged() {
    this.updateTitle();
  }

  updateTitle() {
    const name = (this.merchant.name || "") + " - 移动微官网";
    this.$store.commit("updateTitle", name);
  }
}
</script>
<style lang="scss" scoped>
.website {
  background: rgba(247, 247, 247, 1);

  .cover {
    position: relative;

    img {
      width: 100%;
    }
    .setting {
      position: absolute;
      top: 13px;
      right: 10px;

      padding: 5px 7px;
      background: #ff940f;
      border-radius: 10px;

      i {
        font-size: 28px;
        color: rgba(255, 255, 255, 0.91);
      }
    }
  }

  .content {
    position: relative;
    top: -15px;
    background: rgba(247, 247, 247, 1);
    border-radius: 12px;
    padding-top: 20px;
    padding-bottom: 80px;

    .block {
      margin: 0px 27px;
    }
  }
}
</style>
