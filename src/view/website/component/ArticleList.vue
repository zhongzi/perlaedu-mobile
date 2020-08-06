<template>
  <div class="wrapper article">
    <ai-list-stored
      class="list"
      resource="article"
      :query="innerQuery"
      :hideIfNoData="true"
      scrollType="none"
    >
      <template v-slot:header>
        <img
          v-if="skin.title"
          :src="skin.title.image"
          :style="skin.title.style"
        />
        <div v-else>最新动态</div>
      </template>
      <template v-slot:item="{ item, index }">
        <div v-if="index === 0" class="image" @click="openArticle(item)">
          <img :src="item.cover | alioss({ width: 200, height: 250 })" />
        </div>
        <ai-line v-else />
        <a-article :article="item" />
      </template>
    </ai-list-stored>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

import SyncMixin from "@/mixin/SyncMixin";

import AiListStored from "@/view/component/AiListStored.vue";
import AiLine from "@/view/component/AiLine.vue";

import AArticle from "./Article.vue";

import merge from "lodash/merge";
import isEmpty from "lodash/isEmpty";
import _get from "lodash/get";

@Component({
  components: {
    AiListStored,
    AiLine,
    AArticle,
  },
})
export default class Home extends Vue {
  @Prop({ type: Object, default: null }) query: any;
  @Prop({ type: Object, default: null }) merchant: any;

  get skin() {
    return _get(this.merchant, "website.skin.article", {});
  }

  get innerQuery() {
    return merge({}, this.query || {});
  }

  openArticle(article) {
    if (!isEmpty(article.url)) {
      window.location.href = article.url;
      return;
    }
    this.$router.push({
      name: "websiteMerchantArticle",
      params: {
        articleId: article.id,
      },
    });
  }
}
</script>
<style lang="scss" scoped>
.article {
  padding: 0px 20px 20px;

  .list {
    padding-bottom: 20px;
  }

  & ::v-deep .ai-list-stored__list {
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.8);
  }

  .image {
    padding: 5px;
    max-height: 183px;
    border-radius: 4px;
    overflow: hidden;

    img {
      border-radius: 4px;
      width: 100%;
      object-fit: fill;
      display: block;
    }
  }
}
</style>
