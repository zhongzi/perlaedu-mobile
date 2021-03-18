<template>
  <div :class="[b(), { [b('editing')]: isEditing }]">
    <ai-tab v-if="enableTab" v-model="curTabIdx" :tabs="tabs" class="tabs" />
    <template v-if="isEditing">
      <ai-input-textarea
        v-if="!enableTab || curTab.value === 'text'"
        :class="['media', { 'media-in-tab': enableTab }]"
        :value="content"
        :rows="rows"
        :maxLength="maxLength"
        @input="updateContent"
      />
    </template>
    <template v-else>
      <div :class="b('content')">{{ content }}</div>
    </template>
    <ai-audio
      v-if="
        (enableTab && curTab.value === 'audio') ||
        (!enableTab && isEditing) ||
        (!isEditing && audios.length > 0)
      "
      :medias="audios"
      :merchantId="merchantId"
      :kind="kind"
      :limit="limit"
      :isEditing="isEditing"
      @changed="updateMedias"
      :class="['media', { 'media-in-tab': enableTab }]"
    />
    <ai-image
      v-if="
        (enableTab && curTab.value === 'image') ||
        (!enableTab && isEditing) ||
        (!isEditing && images.length > 0)
      "
      :medias="images"
      :merchantId="merchantId"
      :kind="kind"
      :limit="limit"
      :isEditing="isEditing"
      @changed="updateMedias"
      :class="['media', { 'media-in-tab': enableTab }]"
      :showAlbums="showAlbums"
      :albums="albums"
    />
    <ai-video
      v-if="
        (enableTab && curTab.value === 'video') ||
        (!enableTab && isEditing) ||
        (!isEditing && videos.length > 0)
      "
      :medias="videos"
      :merchantId="merchantId"
      :kind="kind"
      :limit="limit"
      :isEditing="isEditing"
      @changed="updateMedias"
      :class="['media', { 'media-in-tab': enableTab }]"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";

import AiTab from "@/view/component/AiTab.vue";
import AiAudio from "@/view/component/AiAudio.vue";
import AiImage from "@/view/component/AiImage.vue";
import AiVideo from "@/view/component/AiVideo.vue";
import AiInputTextarea from "@/view/component/AiInputTextarea.vue";

import filter from "lodash/filter";
import concat from "lodash/concat";

@Component({
  name: "ai-content-media-editor",
  components: {
    AiTab,
    AiAudio,
    AiImage,
    AiVideo,
    AiInputTextarea,
  },
})
export default class Home extends Vue {
  @Prop({ type: [String, Number], default: 0 }) merchantId: string | number;
  @Prop({ type: String, default: "media" }) kind: string;
  @Prop({ type: String, default: null }) content: string;
  @Prop({ type: Array, default: null }) medias: any;
  @Prop({ type: Number, default: 9 }) limit: number;
  @Prop({ type: Boolean, default: true }) isEditing: boolean;
  @Prop({ type: Boolean, default: false }) enableTab: boolean;
  @Prop({ type: Number, default: 300 }) maxLength: number;
  @Prop({ type: Number, default: 5 }) rows: number;
  @Prop({ type: Boolean, default: false }) showAlbums: boolean;
  @Prop({ type: Array, default: null }) albums: any;

  curTabIdx: number = 0;
  tabs: any = [
    {
      label: "文本",
      value: "text",
    },
    {
      label: "语音",
      value: "audio",
    },
    {
      label: "图片",
      value: "image",
    },
    {
      label: "视频",
      value: "video",
    },
  ];

  get curTab() {
    return this.tabs[this.curTabIdx];
  }

  get images() {
    const images = [];
    (this.medias || []).forEach((media) => {
      if (media && media.type === "image") {
        images.push(media);
      }
    });
    return images;
  }

  get audios() {
    const audios = [];
    (this.medias || []).forEach((media) => {
      if (media && media.type === "audio") {
        audios.push(media);
      }
    });
    return audios;
  }

  get videos() {
    const videos = [];
    (this.medias || []).forEach((media) => {
      if (media && media.type === "video") {
        videos.push(media);
      }
    });
    return videos;
  }

  @Watch("medias", { deep: true })
  onMediasChanged() {
    console.log(this.medias);
  }

  updateMedias(media, isAdded = true) {
    if (isAdded) {
      this.$emit("update:medias", concat(this.medias, media));
    } else {
      this.$emit(
        "update:medias",
        filter(this.medias, (m) => m.id != media.id)
      );
    }
  }

  updateContent(content) {
    this.$emit("update:content", content);
  }
}
</script>
<style lang="scss" scoped>
.ai-content-media-editor {
  .media {
    padding: 5px 0px;
  }

  &__content {
    font-size: 14px;
    font-family: MicrosoftYaHei;
    color: #4a4a4a;
    line-height: 19px;
  }

  .media-in-tab {
    min-height: 70px;
  }

  & ::v-deep .ai-input-textarea {
    height: 129px;
    background: #f4f4f4;
    border-radius: 8px;
    border: 1px solid #edecec;

    font-size: 12px;
    font-family: MicrosoftYaHei;
    color: #a5a5a5;
    line-height: 16px;
    padding: 16px;
  }

  .tabs {
    & ::v-deep .h-tab__item {
      padding: 5px;
      height: auto;

      background: #f4f3f2;
      border-radius: 10px;
      margin: 10px 5px;
    }

    & ::v-deep .h-tab_state-select {
      width: 76px;
      height: 34px;
      background: #fa8e45;
      border-radius: 10px;

      font-size: 14px;
      font-family: MicrosoftYaHei;
      color: #ffffff;
      line-height: 19px;
    }

    & ::v-deep .h-tab__indicator {
      display: none;
    }

    & ::v-deep .h-tab_title {
      font-size: 13px;
    }
  }

  & ::v-deep .ai-input-textarea__input {
    min-height: 50px;
  }
}

.ai-content-media-editor__editing {
  min-height: 200px;
}
</style>
