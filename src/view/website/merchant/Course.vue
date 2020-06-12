<template>
  <div class="wrapper course">
    <div class="header">
      <img :src="course.cover" />
      <div class="setting" v-if="isOwner" @click="openEditingCourse">
        <i class="iconfont icon-setting" />
      </div>
      <div
        class="buy"
        @click="openBuyLink"
        v-if="course.bill_url && course.bill_url.length > 0"
      >
        <i class="iconfont icon-cart" />
        <span>购课</span>
      </div>
    </div>
    <div class="content">
      <h3 class="resource title">{{ course.title }}</h3>
      <merchant-cell :merchant="merchant" class="resource unions" />
      <coupon-list :merchant="merchant" class="resource unions" />
      <ai-section class="resource description">
        <template v-slot:header>
          <i class="iconfont icon-course course-icon" />
          <span> 课程详情 </span>
        </template>
        <ai-rich-text-render :value="course.description" />
      </ai-section>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Mixins } from "vue-property-decorator";

import SyncMixin from "@/mixin/SyncMixin";

import AiSection from "@/view/component/AiSection.vue";
import AiRichTextRender from "@/view/component/AiRichTextRender.vue";

import MerchantCell from "../component/MerchantCell.vue";
import CouponList from "../component/CouponList.vue";

import _get from "lodash/get";
import isEqual from "lodash/isEqual";

@Component({
  components: {
    CouponList,
    AiSection,
    MerchantCell,
    AiRichTextRender,
  },
})
export default class Home extends Mixins(SyncMixin) {
  get merchant() {
    return this.course.merchant || {};
  }

  get course() {
    return this.entity;
  }

  get isOwner() {
    return (
      this.merchant.id &&
      _get(this.$auth, "user.is_manager") &&
      isEqual(this.merchant.id, _get(this.$auth, "user.curr_merch_id"))
    );
  }

  created() {
    this.store = "course";
    this.id = this.$route.params.courseId;
    this.loadEntity({
      query: {
        extras: "merchant",
      },
    });
  }

  openEditingCourse() {
    this.$router.push({
      name: "websiteEditingCourse",
      params: {
        courseId: this.course.id,
      },
    });
  }

  openBuyLink() {
    window.location.href = this.course.bill_url;
  }
}
</script>
<style lang="scss" scoped>
.course {
  background: rgba(247, 247, 247, 1);

  .header {
    position: relative;
    min-height: 200px;
    background: rgba(0, 0, 0, 0.3);

    img {
      width: 100%;
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

    .buy {
      background-image: url("~@/asset/image/buy-entry-bg@2x.png");
      background-position: center;
      background-size: cover;

      width: 154px;
      height: 61px;

      position: absolute;
      right: 0px;
      bottom: 0px;

      display: flex;
      align-items: center;
      justify-content: center;

      i {
        font-size: 24px;
        color: rgba(255, 255, 255, 1);
        margin-right: 10px;
      }
      span {
        font-size: 18px;
        font-weight: bold;
        color: rgba(255, 255, 255, 1);
        line-height: 24px;
        letter-spacing: 1px;
      }
    }
  }

  .content {
    position: relative;
    top: -10px;
    background: rgba(247, 247, 247, 1);
    border-radius: 10px;

    min-height: 50vh;
    padding: 10px 23px 25px;

    .resource {
      margin-bottom: 10px;
    }

    .description {
      background: #fff;
      padding: 10px;
      border-radius: 10px;
    }

    .course-icon {
      color: #ff5700;
    }
  }
}
</style>
