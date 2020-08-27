<template>
  <div class="wrapper website">
    <div class="cover">
      <img :src="merchant.cover_url | alioss({ width: 320, height: 180 })" />
      <div class="float">
        <i
          v-if="isOwner"
          class="iconfont icon-setting"
          @click="$router.push({ name: 'websiteEditing' })"
        />
        <i
          v-if="isEnabledPoster"
          class="iconfont icon-share"
          @click="$bus.$emit('inner:config:poster')"
        />
      </div>
    </div>
    <div class="content" :style="mergedStyle" v-if="merchant.id">
      <div class="block">
        <merchant :merchant="merchant" />
        <!--
        <div class="section unions">
          <union-list :query="query" :merchant="merchant" />
        </div>
        -->
        <div class="section coupons" v-if="website.coupon_enabled">
          <coupon-list :query="query" :merchant="merchant" />
        </div>
      </div>
      <div class="section campaigns">
        <campaign-list :query="query" :merchant="merchant" />
      </div>
      <div class="section courses">
        <course-list :query="query" :merchant="merchant" />
      </div>
      <div class="section teachers">
        <teacher-list :query="query" :merchant="merchant" />
      </div>
      <div class="section albums">
        <album-list :query="query" :merchant="merchant" />
      </div>
      <div class="section videos">
        <video-list :query="query" :merchant="merchant" />
      </div>
      <div class="section articles">
        <article-list :query="query" :merchant="merchant" />
      </div>
      <ai-copyright :manual="true" />
      <guide-entry class="block" v-if="showGuide" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Mixins } from "vue-property-decorator";

import SyncMixin from "@/mixin/SyncMixin";

import AiCopyright from "@/view/component/AiCopyright.vue";

import Merchant from "../component/Merchant.vue";
import UnionList from "../component/UnionList.vue";
import CouponList from "../component/CouponList.vue";
import CampaignList from "../component/CampaignList.vue";
import CourseList from "../component/CourseList.vue";
import TeacherList from "../component/TeacherList.vue";
import AlbumList from "../component/AlbumList.vue";
import VideoList from "../component/VideoList.vue";
import ArticleList from "../component/ArticleList.vue";
import GuideEntry from "../guide/component/Entry.vue";

import isEqual from "lodash/isEqual";
import _get from "lodash/get";
import merge from "lodash/merge";
import isEmpty from "lodash/isEmpty";
import startsWith from "lodash/startsWith";
import cloneDeep from "lodash/cloneDeep";

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
    AiCopyright,
    GuideEntry,
  },
})
export default class Home extends Mixins(SyncMixin) {
  get showGuide() {
    return !(
      this.merchant.id === this.$auth.user.curr_merch_id &&
      this.$auth.user.is_manager
    );
  }

  get merchant() {
    return this.entity;
    // const skin = {};
    // return merge(cloneDeep(this.entity), { website: { skin: skin } });
  }

  get isEnabledPoster() {
    return _get(this.merchant, "website.share.poster");
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

  get skin() {
    return this.website.skin || {};
  }

  get mergedStyle() {
    return this.skin.home;
  }

  created() {
    this.store = "merchant";
    this.id = this.$route.params.merchantId;
  }

  @Watch("merchant", { deep: true })
  onMerchantChanged() {
    this.updateTitle();
    this.$bus.$emit("website:menu:style", this.skin.menu);
  }

  updateTitle() {
    const name = (this.merchant.name || "") + " - 门户";
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
      display: block;
    }
    .float {
      position: absolute;
      top: 13px;
      right: 10px;

      display: flex;
      flex-direction: column;

      i {
        font-size: 28px;
        color: rgba(255, 255, 255, 0.91);
        padding: 7px;
        margin: 5px auto;
        background: #ff940f;
        border-radius: 10px;
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
    min-height: calc(100vh - 250px);

    .block {
      margin: 0px 20px;
    }
  }

  .unions {
    margin: 12px auto;
  }
  .coupons {
    margin: 10px auto 20px;
  }
}
</style>
