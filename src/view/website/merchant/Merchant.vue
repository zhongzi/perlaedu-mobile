<template>
  <div class="wrapper website">
    <div class="cover">
      <img :src="merchant.cover_url | alioss({ width: 320, height: 180 })" />
      <div class="float">
        <i
          v-if="isOwner"
          class="iconfont icon-trend"
          @click="
            $router.push({
              name: 'billManagementCoupons',
              query: {
                merchantId: merchant.id,
                curItemId: merchant.website.coupon_id,
              },
            })
          "
        />
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
        <div class="section unions">
          <union-list :query="query" :merchant="merchant" />
        </div>
        <div class="section coupons" v-if="website.coupon_enabled">
          <coupon-list :query="query" :merchant="merchant" />
        </div>
      </div>
      <template v-if="sections">
        <template v-for="section in sections">
          <div
            class="section campaigns"
            v-if="section.sid === 'campaign' && section.enabled"
            :key="section.sid"
          >
            <campaign-list
              :query="query"
              :merchant="merchant"
              :title="section.title"
            />
          </div>

          <div
            class="section courses"
            v-if="section.sid === 'course' && section.enabled"
            :key="section.sid"
          >
            <course-list
              :query="query"
              :merchant="merchant"
              :title="section.title"
            />
          </div>
          <div
            class="section teachers"
            v-if="section.sid === 'teacher' && section.enabled"
            :key="section.sid"
          >
            <teacher-list
              :query="query"
              :merchant="merchant"
              :title="section.title"
            />
          </div>
          <div
            class="section albums"
            v-if="section.sid === 'album' && section.enabled"
            :key="section.sid"
          >
            <album-list
              :query="query"
              :merchant="merchant"
              :title="section.title"
            />
          </div>
          <div
            class="section videos"
            v-if="section.sid === 'video' && section.enabled"
            :key="section.sid"
          >
            <video-list
              :query="query"
              :merchant="merchant"
              :title="section.title"
            />
          </div>
          <div
            class="section articles"
            v-if="section.sid === 'article' && section.enabled"
            :key="section.sid"
          >
            <article-list
              :query="query"
              :merchant="merchant"
              :title="section.title"
            />
          </div>
        </template>
      </template>
      <template v-else>
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
      </template>

      <ai-copyright :manual="true" />
      <ai-register-entry
        class="block"
        v-if="!isOwner"
        subTitle="这样的门户网站， 开启裂变招生"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Mixins } from "vue-property-decorator";

import SyncMixin from "@/mixin/SyncMixin";

import AiCopyright from "@/view/component/AiCopyright.vue";
import AiRegisterEntry from "@/view/component/AiRegisterEntry.vue";

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
import cloneDeep from "lodash/cloneDeep";

@Component({
  components: {
    AiCopyright,
    AiRegisterEntry,
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
    // const skin = {};
    // return merge(cloneDeep(this.entity), { website: { skin: skin } });
  }

  get sections() {
    return _get(this.entity, "website.settings.sections");
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

    .section {
      margin-bottom: 10px;
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
