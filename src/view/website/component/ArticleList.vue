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
        <div>最新动态</div>
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

@Component({
  components: {
    AiListStored,
    AiLine,
    AArticle,
  },
})
export default class Home extends Vue {
  @Prop({ type: Object, default: null }) query: any;

  get innerQuery() {
    return merge({}, this.query || {});
  }

  openArticle(article) {
    if (!isEmpty(article.url)) {
      window.location.href = article.url;
      return;
    }
    this.$router.push({
      name: "websiteArticle",
      params: {
        articleId: article.id,
      },
    });
  }
}
</script>
<style lang="scss" scoped>
.article {
  padding: 0px 27px 20px;

  .list {
    padding-bottom: 20px;
  }

  & ::v-deep .ai-list-stored__list {
    border-radius: 8px;
    background: #ffffff;
  }

  .image {
    padding: 5px;
    img {
      border-radius: 5px;
      width: 100%;
      vertical-align: bottom;
    }
  }
}
</style>
