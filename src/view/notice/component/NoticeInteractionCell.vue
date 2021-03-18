<template>
  <div class="wrapper notice-interaction-cell">
    <ai-cell>
      <template v-slot:cover>
        <div class="title">{{ nickname }}:</div>
      </template>
      <template v-slot:title>
        <!--
        <span class="time"> {{ createdAt | defaultDate }} </span>
        -->
      </template>
      <template v-slot:subtitle>
        <ai-content-media
          :content="description"
          :medias="medias"
          :showAlbums="true"
          :albums="albums"
        />
      </template>
    </ai-cell>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

import AiCell from "@/view/component/AiCell.vue";
import AiContentMedia from "@/view/component/AiContentMedia.vue";

import _get from "lodash/get";
import map from "lodash/map";

@Component({
  components: {
    AiCell,
    AiContentMedia,
  },
})
export default class Home extends Vue {
  @Prop({ type: Object, default: null }) interaction: any;
  @Prop({ type: Array, default: null }) albums: any;

  get nickname() {
    return _get(this.interaction, "user.nickname");
  }

  get createdAt() {
    return _get(this.interaction, "created_at");
  }

  get description() {
    return _get(this.interaction, "description");
  }

  get medias() {
    return map(_get(this.interaction, "attachments") || [], (attachment) => {
      return attachment.media;
    });
  }
}
</script>
<style lang="scss" scoped>
.notice-interaction-cell {
  width: 100%;
  padding: 5px 0px;

  &:focus {
    background: #c3c2c2;
  }

  & ::v-deep .ai-cell {
    min-height: auto;
    align-items: start;

    &__left {
      align-items: start;
    }
  }

  .time {
    color: #4a4a4a;
    font-size: 12px;
    line-height: 1.2;
  }

  .title {
    min-width: 90px;
    text-align: right;
    margin-right: 5px;

    word-wrap: break-word;
    font-size: 14px;
    font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
    font-weight: bold;
    color: #4a4a4a;
    line-height: 19px;
  }
}
</style>
