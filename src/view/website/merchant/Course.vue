<template>
  <div class="wrapper course">
    <div class="header">
      <img :src="course.cover | alioss({ width: 300 })" />
      <div class="setting" v-if="isOwner" @click="openEditingCourse">
        <i class="iconfont icon-setting" />
      </div>
      <div class="buy" @click="openBuyLink" v-if="showBuyLink">
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
        <ai-rich-text-sections-editor
          :is-editing="false"
          :value="course.description"
        />
      </ai-section>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Mixins } from "vue-property-decorator";

import SyncMixin from "@/mixin/SyncMixin";

import AiSection from "@/view/component/AiSection.vue";
import AiRichTextSectionsEditor from "@/view/component/AiRichTextSectionsEditor.vue";

import MerchantCell from "../component/MerchantCell.vue";
import CouponList from "../component/CouponList.vue";

import _get from "lodash/get";
import isEqual from "lodash/isEqual";
import isEmpty from "lodash/isEmpty";

@Component({
  components: {
    CouponList,
    AiSection,
    MerchantCell,
    AiRichTextSectionsEditor,
  },
})
export default class Home extends Mixins(SyncMixin) {
  get merchant() {
    return this.course.merchant || {};
  }

  get course() {
    return this.entity;
  }

  get showBuyLink() {
    return !isEmpty(this.course.bill_url) || this.course.bill_id > 0;
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
        extras: JSON.stringify({
          Course: ["merchant", "bill"],
          Merchant: ["count_persons"],
        }),
      },
    });
  }

  @Watch("course", { deep: true })
  onCouseChanged() {
    this.$store.commit("updateTitle", `${this.course.title}-课程详情`);
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
    if (!isEmpty(this.course.bill_url)) {
      window.location.href = this.course.bill_url;
      return;
    }

    this.$router.push({
      name: "bill",
      params: {
        merchantId: _get(this.course, "bill.merchant_id"),
        projectId: _get(this.course, "bill.id"),
        openid: _get(this.course, "bill.openid"),
        items: "new",
      },
    });
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
    padding: 25px 23px;

    .resource {
      margin-bottom: 10px;
    }

    .description {
      padding: 10px;
      border-radius: 10px;
    }

    .course-icon {
      color: #ff5700;
    }
  }
}
</style>
