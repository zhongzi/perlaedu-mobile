<template>
  <div class="wrapper">
    <ai-image-uploader
      class="cover"
      v-model="innerArticle.cover"
      type="website"
      :prefix="'websites/' + merchantId + '/articles'"
      triggerName="article-cover"
    />
    <div class="fields">
      <ai-input-borderless
        class="field"
        label="标题"
        v-model="innerArticle.title"
      />
      <ai-input-borderless
        class="field"
        label="标签(逗号间隔)"
        v-model="innerArticle.keywords"
      />
      <ai-input-switch class="field" label="是否为外链" v-model="isLink" />
      <ai-input-borderless
        class="field"
        label="访问链接"
        v-model="innerArticle.url"
        v-if="isLink"
      />
      <ai-section class="field" v-else>
        <template v-slot:header>
          <span> 详情 </span>
        </template>
        <ai-rich-text-editor
          v-model="innerArticle.description"
          imageType="merchant"
          :imagePrefix="'merchants/' + merchantId + '/articles'"
        />
      </ai-section>
    </div>
    <ai-submit-actions @submit="onSubmit" @cancel="onCancel" />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Mixins, Watch } from "vue-property-decorator";

import SyncMixin from "@/mixin/SyncMixin";

import AiImageUploader from "@/view/component/AiImageUploader.vue";
import AiInputBorderless from "@/view/component/AiInputBorderless.vue";
import AiSubmitActions from "@/view/component/AiSubmitActions.vue";
import AiRichTextEditor from "@/view/component/AiRichTextEditor.vue";
import AiSection from "@/view/component/AiSection.vue";
import AiInputSwitch from "@/view/component/AiInputSwitch.vue";

import isEmpty from "lodash/isEmpty";
import isEqual from "lodash/isEqual";
import _get from "lodash/get";
import merge from "lodash/merge";
import debounce from "lodash/debounce";
import cloneDeep from "lodash/cloneDeep";

@Component({
  components: {
    AiImageUploader,
    AiInputBorderless,
    AiSubmitActions,
    AiRichTextEditor,
    AiSection,
    AiInputSwitch,
  },
})
export default class Home extends Mixins(SyncMixin) {
  isLink: boolean = false;
  innerArticle: any = {
    id: "",
    cover: "",
    title: "",
    description: "",
    remark: "",
    url: "",
  };

  get article() {
    return this.entity;
  }

  get merchantId() {
    return parseInt(this.$route.params.merchantId);
  }

  get articleId() {
    return parseInt(this.$route.params.articleId);
  }

  created() {
    this.store = "article";
    this.load();
  }

  @Watch("$route", { deep: true })
  onRouteChanged() {
    this.load();
  }

  @Watch("article", { deep: true })
  onArticleChanged() {
    if (isEqual(this.article, this.innerArticle)) return;

    this.innerArticle = merge(this.innerArticle, this.article);
    this.isLink = !isEmpty(this.innerArticle.url);
  }

  load() {
    if (this.articleId) {
      this.id = this.articleId;
      this.loadEntity();
    }
  }

  onCancel() {
    this.$router.go(-1);
  }

  onSubmit() {
    if (!this.merchantId) return;

    this.innerArticle.url = this.isLink ? this.innerArticle.url : "";
    this.id = this.article.id;
    this.saveEntity({
      res: cloneDeep(
        merge(this.innerArticle, { merchant_id: this.merchantId })
      ),
      success: () => {
        this.$nextTick(() => {
          this.$router.go(-1);
        });
      },
    });
  }
}
</script>
<style lang="scss" scoped>
.wrapper {
  .fields {
    position: relative;
    top: -15px;
    background: #fff;
    border-radius: 12px 12px 0px 0px;

    padding-top: 17px;
    padding-left: 17px;
    padding-right: 17px;
  }
}
</style>
