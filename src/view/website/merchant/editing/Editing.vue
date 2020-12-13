<template>
  <div class="wrapper editing">
    <merchant :merchant="merchant" />
    <skin :merchant="merchant" />
    <sections :merchant="merchant" />
    <div class="resources">
      <div class="section">
        <union-merchant-list class="resource" :query="query" />
        <universe-coupon class="resource coupon" :merchant="merchant" />
        <ai-line />
      </div>

      <campaigns-entry
        class="resource campaign"
        v-if="!sectionCampaign || sectionCampaign.enabled"
        :key="sectionCampaign && sectionCampaign.sid"
        :title="sectionCampaign && sectionCampaign.title"
      />
      <course-list
        class="resource slide"
        :query="query"
        :merchant="merchant"
        v-if="!sectionCourse || sectionCourse.enabled"
        :key="sectionCourse && sectionCourse.sid"
        :title="sectionCourse && sectionCourse.title"
      />
      <teacher-list
        class="resourc slide"
        :query="query"
        :merchant="merchant"
        v-if="!sectionTeacher || sectionTeacher.enabled"
        :key="sectionTeacher && sectionTeacher.sid"
        :title="sectionTeacher && sectionTeacher.title"
      />
      <album-list
        class="resource slide"
        :query="query"
        :merchant="merchant"
        v-if="!sectionAlbum || sectionAlbum.enabled"
        :key="sectionAlbum && sectionAlbum.sid"
        :title="sectionAlbum && sectionAlbum.title"
      />
      <video-list
        class="resource slide"
        :query="query"
        :merchant="merchant"
        v-if="!sectionVideo || sectionVideo.enabled"
        :key="sectionVideo && sectionVideo.sid"
        :title="sectionVideo && sectionVideo.title"
      />
      <article-list
        class="resource section"
        :query="query"
        :merchant="merchant"
        v-if="!sectionArticle || sectionArticle.enabled"
        :key="sectionArticle && sectionArticle.sid"
        :title="sectionArticle && sectionArticle.title"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Mixins } from "vue-property-decorator";

import SyncMixin from "@/mixin/SyncMixin";
import AiLine from "@/view/component/AiLine.vue";

import Merchant from "./component/Merchant.vue";
import UnionMerchantList from "./component/UnionMerchantList.vue";
import UniverseCoupon from "./component/UniverseCoupon.vue";
import CampaignsEntry from "./component/CampaignsEntry.vue";
import CourseList from "./component/CourseList.vue";
import TeacherList from "./component/TeacherList.vue";
import VideoList from "./component/VideoList.vue";
import AlbumList from "./component/AlbumList.vue";
import ArticleList from "./component/ArticleList.vue";
import Skin from "./component/Skin.vue";
import Sections from "./component/Sections.vue";

import _get from "lodash/get";
import filter from "lodash/filter";

@Component({
  components: {
    AiLine,
    Merchant,
    UnionMerchantList,
    UniverseCoupon,
    CampaignsEntry,
    CourseList,
    TeacherList,
    VideoList,
    AlbumList,
    ArticleList,
    Skin,
    Sections,
  },
})
export default class Home extends Mixins(SyncMixin) {
  get merchant() {
    return this.entity;
  }

  get sections() {
    return _get(this.entity, "website.settings.sections");
  }

  get sectionCampaign() {
    return filter(this.sections, { sid: "campaign" })[0];
  }

  get sectionCourse() {
    return filter(this.sections, { sid: "course" })[0];
  }

  get sectionTeacher() {
    return filter(this.sections, { sid: "teacher" })[0];
  }

  get sectionAlbum() {
    return filter(this.sections, { sid: "album" })[0];
  }

  get sectionVideo() {
    return filter(this.sections, { sid: "video" })[0];
  }

  get sectionArticle() {
    return filter(this.sections, { sid: "article" })[0];
  }

  get query() {
    return {
      merchant_id: this.merchant.id,
    };
  }

  created() {
    this.enableLoading = false;
    this.store = "merchant";
    this.id = this.$route.params.merchantId;
    this.loadEntity({
      query: {
        extras: JSON.stringify({
          Merchant: ["location", "cover_url", "website"],
          Website: ["skin", "settings"],
        }),
      },
    });
  }
}
</script>
<style lang="scss" scoped>
.editing {
  padding-bottom: 80px;

  .resources {
    overflow: hidden;

    .section {
      padding: 0px 20px;

      .coupon {
        padding: 0px 7px;
      }

      .campaign {
        margin: 10px auto;
      }
    }

    .resource {
      margin-bottom: 20px;
    }
  }
}
</style>
