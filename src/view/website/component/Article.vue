<template>
  <div class="wrapper">
    <ai-cell v-if="article" :showBottomLine="false" @click.native="onClick">
      <template v-slot:title>
        <div class="title">{{ article.title }}</div>
      </template>
      <template v-slot:right>
        <img
          :src="article.cover | alioss({ width: 40, height: 30 })"
          class="image"
        />
      </template>
    </ai-cell>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

import AiCell from "@/view/component/AiCell.vue";

import isEmpty from "lodash/isEmpty";

@Component({
  components: {
    AiCell,
  },
})
export default class Home extends Vue {
  @Prop({ type: Object, default: null }) article: any;
  @Prop({ type: String, default: "websiteMerchantArticle" }) routeName: string;

  onClick() {
    console.log(this.routeName);
    if (!isEmpty(this.article.url)) {
      window.location.href = this.article.url;
      return;
    }
    this.$router.push({
      name: this.routeName,
      params: {
        articleId: this.article.id,
      },
    });
  }
}
</script>
<style lang="scss" scoped>
.wrapper {
  margin: 10px 10px 10px 15px;

  .image {
    max-width: 71px;
    max-height: 40px;
    border-radius: 4px;
  }
}
</style>
