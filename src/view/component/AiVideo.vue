<template>
  <div :class="b()">
    <div :class="b('title')" v-if="isEditing">视频 (最多{{ limit }} 个)</div>
    <div :class="b('medias')">
      <template v-for="media in medias">
        <div :class="b('media')" :key="media.id">
          <ai-video-ali-player-new :media="media" :medias="medias" />
          <i
            v-if="isEditing"
            class="iconfont icon-trash"
            @click="removeMedia(media)"
          />
        </div>
      </template>
      <!--
      <ai-video-ali-uploader-new
        v-if="isEditing"
        v-show="innerLimit > 0"
        :class="b('media')"
        :kind="kind"
        :limit="innerLimit"
        :merchantId="merchantId"
        @input:media="addMedia"
      />
-->
      <ai-video-picker-popup
        v-if="isEditing"
        v-show="innerLimit > 0"
        :class="b('media')"
        :kind="kind"
        :limit="innerLimit"
        :merchantId="merchantId"
        @input:media="addMedia"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Mixins } from "vue-property-decorator";

import SyncMixin from "@/mixin/SyncMixin";
import AiVideoAliPlayerNew from "./AiVideoAliPlayerNew.vue";
import AiVideoAliUploaderNew from "./AiVideoAliUploaderNew.vue";
import AiVideoPickerPopup from "./AiVideoPickerPopup.vue";

@Component({
  name: "ai-video",
  components: {
    AiVideoAliPlayerNew,
    AiVideoPickerPopup,
  },
})
export default class Home extends Mixins(SyncMixin) {
  @Prop({ type: String, default: "" }) kind: string;
  @Prop({ type: Array, default: () => [] }) medias: any;
  @Prop({ type: Number, default: 9 }) limit: number;
  @Prop({ type: Boolean, default: false }) isEditing: boolean;
  @Prop({ type: [String, Number], default: 0 }) merchantId: string | number;

  get innerLimit() {
    return this.limit - (this.medias || []).length;
  }

  addMedia(media) {
    this.$emit("changed", media, true);
  }

  removeMedia(media) {
    this.$emit("changed", media, false);
  }
}
</script>
<style lang="scss" scoped>
.ai-video {
  &__title {
    font-size: 12px;
    line-height: 2;
    font-weight: 700;
  }

  &__medias {
    display: grid;
    gap: 5px;
    grid-template-columns: repeat(6, 1fr);
  }

  &__media {
    position: relative;
    height: 12vw;
    overflow: hidden;

    i {
      position: absolute;
      top: 0px;
      right: 0px;
      color: red;
      font-weight: 800;
      line-height: 1;
    }
  }
}
</style>
