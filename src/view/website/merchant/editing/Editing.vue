<template>
  <div class="wrapper editing">
    <merchant :merchant="merchant" />
    <skin :merchant="merchant" />
    <div class="resources">
      <div class="section">
        <union-merchant-list class="resource" :query="query" />
        <universe-coupon class="resource coupon" :merchant="merchant" />
        <ai-line />

        <campaigns-entry class="resource campaign" />
      </div>

      <course-list class="resource slide" :query="query" :merchant="merchant" />
      <teacher-list class="resourc slide" :query="query" :merchant="merchant" />
      <album-list class="resource slide" :query="query" :merchant="merchant" />
      <video-list class="resource slide" :query="query" :merchant="merchant" />
      <article-list
        class="resource section"
        :query="query"
        :merchant="merchant"
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
  },
})
export default class Home extends Mixins(SyncMixin) {
  get merchant() {
    return this.entity;
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
          Website: ["skin"],
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
