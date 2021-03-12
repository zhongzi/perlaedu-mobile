<template>
  <div class="wrapper">
    <ai-cell v-if="article" :showBottomLine="false" @click.native="onClick">
      <template v-slot:title>
        <div class="title">
          {{ article.title }}
        </div>
      </template>
      <template v-slot:right>
        <div class="cover">
          <img :src="article.cover | alioss({ width: 48, height: 27 })" />
        </div>
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
  padding: 8px 10px;

  .title {
    padding-right: 10px;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    color: #4a4a4a;
    line-height: 1.2;
    text-align: justify;
  }

  .cover {
    width: 71px;
    height: 40px;
    border-radius: 4px;
    overflow: hidden;

    img {
      border-radius: 4px;
      width: 100%;
      object-fit: cover;
    }
  }
}
</style>
