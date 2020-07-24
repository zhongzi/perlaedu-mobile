<template>
  <div class="wrapper article-add-entry">
    <hui-button class="plus" @click.native="openEditingArticle">
      <i class="iconfont icon-plus" />
    </hui-button>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

import cloneDeep from "lodash/cloneDeep";
import merge from "lodash/merge";

@Component
export default class Home extends Vue {
  openEditingArticle() {
    this.$router.push({
      name: "websiteEditingArticle",
      params: {
        articleId: "new",
      },
    });
  }
}
</script>
<style lang="scss" scoped>
.article-add-entry {
  width: 100%;

  .plus {
    width: 100%;
    height: 72px;
    border: none;
    i {
      font-size: 18px;
      color: #4a4a4a66;
    }
  }
}
</style>
