<template>
  <div class="wrapper union">
    <template v-if="union.id">
      <div class="cover">
        <img :src="cover" />
      </div>
      <div class="content" :style="mergedStyle">
        <div class="info">
          <div class="title">
            {{ union.name }}
          </div>
          <div class="desc">
            <i class="iconfont icon-location" />
            本综合体有{{ union.count_merchants }}家优质培训机构组成
          </div>
          <div class="address" v-if="union.location && union.location.address">
            <i class="iconfont icon-location" />
            <span>{{ union.location | safe("address") }}</span>
          </div>
        </div>
        <div class="section merchants">
          <union-merchant-list :union="union" />
        </div>
        <div class="section courses">
          <union-course-list :union="union" />
        </div>
        <div class="section articles">
          <union-article-list :union="union" />
        </div>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Mixins } from "vue-property-decorator";

import SyncMixin from "@/mixin/SyncMixin";

import UnionMerchantList from "../component/UnionMerchantList.vue";
import UnionCourseList from "../component/UnionCourseList.vue";
import UnionArticleList from "../component/UnionArticleList.vue";

import isEqual from "lodash/isEqual";
import _get from "lodash/get";
import merge from "lodash/merge";
import isEmpty from "lodash/isEmpty";
import startsWith from "lodash/startsWith";

@Component({
  components: {
    UnionMerchantList,
    UnionCourseList,
    UnionArticleList,
  },
})
export default class Home extends Mixins(SyncMixin) {
  get union() {
    return this.entity;
  }

  get cover() {
    return isEmpty(this.union.cover_url)
      ? require("@/asset/image/default_website_cover" +
          this.$densityStr +
          ".png")
      : this.union.cover_url;
  }

  get website() {
    return this.union.website || {};
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
      : "linear-gradient(180deg,rgba(237,146,108,1) 0%,rgba(244,108,55,1) 55%,rgba(218,108,67,1) 100%)";
  }

  get mergedStyle() {
    return merge(
      {
        backgroundImage: this.bgImage,
        backgroundRepeat: "repeat-y",
        backgroundPosition: "center top",
        backgroundSize: "contain",
      },
      this.union.style || {}
    );
  }

  created() {
    this.store = "union";
    this.id = this.$route.params.unionId;
  }
}
</script>
<style lang="scss" scoped>
.union {
  background: rgba(247, 247, 247, 1);

  .cover {
    position: relative;

    img {
      width: 100%;
      display: block;
    }
    .setting {
      position: absolute;
      top: 18px;
      right: 17px;

      i {
        font-size: 28px;
        color: rgba(255, 255, 255, 0.91);
      }
    }
  }

  .content {
    min-height: 70vh;
    position: relative;
    padding-top: 20px;
    padding-bottom: 100px;

    .info {
      background: rgba(255, 255, 255, 0.8);
      border-radius: 8px;
      padding: 10px 20px;
      margin: 0px 27px 20px;

      .title {
        font-size: 15px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 500;
        color: #4a4a4a;
        line-height: 21px;
      }

      .desc {
        font-size: 13px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #9b9b9b;
        line-height: 18px;

        i {
          color: #d81e06;
        }
      }
      .address {
        i {
          width: 12px;
          height: 15px;
          color: rgba(216, 30, 6, 1);
          margin-right: 10px;
        }
        span {
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: rgba(74, 74, 74, 1);
          line-height: 20px;
          margin: 0px;
        }
      }
    }
  }
}
</style>
