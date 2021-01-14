<template>
  <div class="wrapper editing">
    <merchant :merchant="merchant" />
    <div class="resources">
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
        class="resource article"
        :query="query"
        :merchant="merchant"
        v-if="!sectionArticle || sectionArticle.enabled"
        :key="sectionArticle && sectionArticle.sid"
        :title="sectionArticle && sectionArticle.title"
      />
      <settings class="resource settings" :merchant="merchant" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Mixins } from "vue-property-decorator";

import SyncMixin from "@/mixin/SyncMixin";
import AiLine from "@/view/component/AiLine.vue";

import Merchant from "./component/Merchant.vue";
import CourseList from "./component/CourseList.vue";
import TeacherList from "./component/TeacherList.vue";
import VideoList from "./component/VideoList.vue";
import AlbumList from "./component/AlbumList.vue";
import ArticleList from "./component/ArticleList.vue";
import Settings from "./component/Settings.vue";

import _get from "lodash/get";
import filter from "lodash/filter";

@Component({
  components: {
    AiLine,
    Merchant,
    CourseList,
    TeacherList,
    VideoList,
    AlbumList,
    ArticleList,
    Settings,
  },
})
export default class Home extends Mixins(SyncMixin) {
  get merchant() {
    return this.entity;
  }

  get sections() {
    return _get(this.entity, "website.settings.sections");
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

    .article {
      padding: 0px 20px;
    }
    .settings {
      margin: 20px;
    }
  }
}
</style>
