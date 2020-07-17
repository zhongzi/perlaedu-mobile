<template>
  <ai-section class="wrapper editing-articles" title="学校动态">
    <article-add-entry :merchant="merchant" class="plus" />
    <ai-list-stored
      resource="article"
      :query="innerQuery"
      :refresh.sync="refresh"
      scrollType="none"
      :enableEmpty="false"
    >
      <template v-slot:item="{ item, tag }">
        <ai-card class="item">
          <template v-slot:header>
            <div class="header">
              <img :src="item.cover" />
              <div class="mask">
                <i
                  class="iconfont icon-editing"
                  @click="gotoEditingArticle(item)"
                />
                <i class="iconfont icon-trash" @click="onDelete(item, tag)" />
              </div>
            </div>
          </template>
          <template v-slot:body>
            <div class="body">
              {{ item.title }}
            </div>
          </template>
        </ai-card>
      </template>
    </ai-list-stored>
  </ai-section>
</template>

<script lang="ts">
import { Component, Vue, Prop, Mixins } from "vue-property-decorator";

import SyncMixin from "@/mixin/SyncMixin";

import AiListStored from "@/view/component/AiListStored.vue";
import AiSection from "@/view/component/AiSection.vue";
import AiCard from "@/view/component/AiCard.vue";

import ArticleAddEntry from "./ArticleAddEntry.vue";

import merge from "lodash/merge";

@Component({
  components: {
    AiListStored,
    AiSection,
    ArticleAddEntry,
    AiCard,
  },
})
export default class Home extends Mixins(SyncMixin) {
  @Prop({ type: Object, default: null }) query: any;
  @Prop({ type: Object, default: null }) merchant: any;

  refresh: boolean = false;

  get innerQuery() {
    return merge(
      {
        merchant_id: this.merchant && this.merchant.id,
      },
      this.query || {}
    );
  }

  gotoEditingArticle(article) {
    this.$router.push({
      name: "websiteEditingArticle",
      params: {
        articleId: article.id,
      },
    });
    return;
  }

  onDelete(article, tag) {
    this.store = "article";
    this.id = article.id;
    this.tag = tag;
    this.deleteEntity({
      res: { id: this.id },
      success: () => {
        this.$nextTick(() => {
          this.refresh = true;
        });
      },
    });
  }
}
</script>
<style lang="scss" scoped>
.editing-articles {
  .plus {
    margin: 10px auto;
  }

  .item {
    margin: 10px 0px;
    padding: 10px;

    .header {
      max-height: 150px;
      position: relative;
      border-radius: 10px;

      .mask {
        position: absolute;
        top: 0px;
        bottom: 0px;
        left: 0px;
        right: 0px;
        background: rgba(0, 0, 0, 0.4);

        display: flex;
        align-items: center;
        justify-content: space-around;

        i {
          font-size: 24px;
          color: #fff;
        }
      }
    }
  }
}
</style>
