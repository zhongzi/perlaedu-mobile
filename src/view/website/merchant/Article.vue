<template>
  <div class="wrapper article">
    <div class="header">
      <div class="title">{{ article.title }}</div>
      <div class="info">
        <span class="declare"> 原创 </span>
        <span v-if="article.user && article.user.nickname">
          {{ article | safe("user.nickname") }}
        </span>
        <span class="name" @click="openWebsite"> {{ website.name }}</span>
        <span> {{ article.created_at | distanceFromDatetime(true) }} </span>
      </div>
    </div>
    <ai-rich-text-sections-editor
      :is-editing="false"
      class="content"
      :value="article.description"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Mixins } from "vue-property-decorator";

import SyncMixin from "@/mixin/SyncMixin";

import AiCard from "@/view/component/AiCard.vue";
import AiRichTextSectionsEditor from "@/view/component/AiRichTextSectionsEditor.vue";

import isEmpty from "lodash/isEmpty";

@Component({
  components: {
    AiCard,
    AiRichTextSectionsEditor,
  },
})
export default class Home extends Mixins(SyncMixin) {
  website: any = {};

  get article() {
    return this.entity;
  }

  get isInUnion() {
    return this.$route.name === "websiteUnionArticle";
  }

  created() {
    this.store = "article";
    this.id = this.$route.params.articleId;
    this.loadEntity({
      query: {
        extras: "merchant,user",
      },
    });

    this.loadEntityExtra({
      store: this.isInUnion ? "union" : "merchant",
      id: this.isInUnion
        ? this.$route.params.unionId
        : this.$route.params.merchantId,
      success: (resp) => {
        this.website = resp.data;
      },
    });
  }

  @Watch("article", { deep: true })
  onArticleChanged() {
    this.$store.commit("updateTitle", `${this.article.title}`);
    this.share();
  }

  openWebsite() {
    this.$router.push({
      name: this.isInUnion ? "websiteUnion" : "websiteMerchant",
    });
  }

  share() {
    if (isEmpty(this.article)) return;

    this.$bus.$emit("config:share", {
      title: this.article.title,
      desc: this.$tools.getShareDesc(this.article.description),
      imgUrl: this.article.cover,
    });
  }
}
</script>
<style lang="scss" scoped>
.article {
  min-height: 100vh;
  padding: 10px 15px;

  .header {
    .title {
      font-size: 20px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: rgba(74, 74, 74, 1);
      line-height: 1.5;
      margin-top: 15px;
      margin-bottom: 15px;
    }
    .info {
      font-size: 13px;
      font-family: PingFangSC-Regular, PingFang SC;
      color: rgba(155, 155, 155, 1);
      line-height: 1.8;

      span {
        margin-right: 8px;
      }

      .name {
        color: rgba(55, 76, 109, 1);
      }
      .declare {
        color: #fff;
        background: rgba(155, 155, 155, 1);
        padding: 3px 6px;
        font-size: 10px;
        border-radius: 5px;
      }
    }
  }
  .content {
    min-height: 70%;
  }
}
</style>
