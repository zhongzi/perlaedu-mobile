<template>
  <div class="wrapper article">
    <div class="header">
      <div class="title">{{ article.title }}</div>
      <div class="info">
        <span @click="openWebsite"> {{ article | safe("merchant.name") }}</span>
        <span> {{ article.updated_at | defaultDate }} </span>
      </div>
    </div>
    <ai-rich-text-render class="content" :value="article.description" />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Mixins } from "vue-property-decorator";

import SyncMixin from "@/mixin/SyncMixin";

import AiCard from "@/view/component/AiCard.vue";
import AiRichTextRender from "@/view/component/AiRichTextRender.vue";

@Component({
  components: {
    AiCard,
    AiRichTextRender,
  },
})
export default class Home extends Mixins(SyncMixin) {
  get article() {
    return this.entity;
  }

  created() {
    this.store = "article";
    this.id = this.$route.params.articleId;
    this.loadEntity({
      query: {
        extras: "merchant",
      },
    });
  }

  openWebsite() {
    this.$router.push({
      name: "websiteMerchant",
      params: {
        merchantId: this.article.merchant_id,
      },
    });
  }
}
</script>
<style lang="scss" scoped>
.article {
  padding: 10px;
  height: 100vh;

  img {
    width: 100%;
  }

  .header {
    .title {
      font-size: 18px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: rgba(74, 74, 74, 1);
      line-height: 3;
    }
    .info {
      font-size: 13px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 600;
      color: rgba(155, 155, 155, 1);
      line-height: 1;
      margin-bottom: 20px;

      span:nth-child(1) {
        color: #0099cc;
        margin-right: 10px;
      }
    }
  }
  .content {
    padding: 10px;
    background: #fff;
    min-height: 70%;
  }
}
</style>
