<template>
  <div class="wrapper notice-content">
    <ai-card>
      <template v-slot:body>
        <div class="content">
          <!--
          <div class="label">{{ title }}</div>
-->
          <ai-content-media :content="description" :medias="medias" />
          <a v-if="link" :href="link">
            <i class="iconfont icon-link" style="color: red" /> 点击前往
          </a>
        </div>
      </template>
    </ai-card>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

import AiCard from "@/view/component/AiCard.vue";
import AiContentMedia from "@/view/component/AiContentMedia.vue";

import NoticeRecipientCell from "./NoticeRecipientCell.vue";

import _get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import map from "lodash/map";

@Component({
  components: {
    AiCard,
    AiContentMedia,
    NoticeRecipientCell,
  },
})
export default class Home extends Vue {
  @Prop({ type: Object, default: null }) notice: any;

  get title() {
    return _get(this.notice, "title");
  }

  get description() {
    return _get(this.notice, "description");
  }

  get medias() {
    return map(_get(this.notice, "attachments") || [], (attachment) => {
      return attachment.media;
    });
  }

  get myself() {
    return _get(this.notice, "myself") || [];
  }

  get link() {
    const link = _get(this.notice, "link");
    return isEmpty(link) ? null : link;
  }
}
</script>
<style lang="scss" scoped>
.notice-content {
  font-size: 13px;
  line-height: 2;

  .content {
    min-height: 65vh;
    padding: 10px;
    .label {
      text-align: center;
      font-size: 14px;
      font-weight: 800;
      line-height: 5;
    }
  }
}
</style>
