<template>
  <div class="wrapper editing">
    <merchant :merchant="merchant" />
    <div class="resources">
      <union-merchant-list class="resource" :query="query" />
      <universe-coupon class="resource" :merchant="merchant" />

      <campaigns-entry class="resource" />

      <course-list class="resource" :query="query" :merchant="merchant" />
      <teacher-list class="resource" :query="query" :merchant="merchant" />
      <video-list class="resource" :query="query" :merchant="merchant" />
      <album-list class="resource" :query="query" :merchant="merchant" />
      <article-list class="resource" :query="query" :merchant="merchant" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Mixins } from "vue-property-decorator";

import SyncMixin from "@/mixin/SyncMixin";

import Merchant from "./component/Merchant.vue";
import UnionMerchantList from "./component/UnionMerchantList.vue";
import UniverseCoupon from "./component/UniverseCoupon.vue";
import CampaignsEntry from "./component/CampaignsEntry.vue";
import CourseList from "./component/CourseList.vue";
import TeacherList from "./component/TeacherList.vue";
import VideoList from "./component/VideoList.vue";
import AlbumList from "./component/AlbumList.vue";
import ArticleList from "./component/ArticleList.vue";

@Component({
  components: {
    Merchant,
    UnionMerchantList,
    UniverseCoupon,
    CampaignsEntry,
    CourseList,
    TeacherList,
    VideoList,
    AlbumList,
    ArticleList,
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
        extras: "location, cover_url",
      },
    });
  }
}
</script>
<style lang="scss" scoped>
.editing {
  padding-bottom: 80px;

  .resources {
    padding: 0px 20px;

    .resource {
      margin-bottom: 20px;
    }
  }
}
</style>
