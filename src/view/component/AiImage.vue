<template>
  <div :class="b()">
    <div :class="b('title')" v-if="isEditing">照片 (最多{{ limit }}张)</div>
    <div :class="b('medias')">
      <template v-for="(media, index) in medias">
        <div :class="b('media')" :key="media.id">
          <ai-image-player
            :media="media"
            :medias="medias"
            :index="index"
            :showAlbums="showAlbums"
            :albums="albums"
          />
          <i
            v-if="isEditing"
            class="iconfont icon-trash"
            @click="removeMedia(media)"
          />
        </div>
      </template>
      <ai-image-uploader-new
        v-if="isEditing && enableCropper"
        v-show="innerLimit > 0"
        icon="plus"
        :class="b('media')"
        :kind="kind"
        :merchantId="merchantId"
        @input:media="addMedia"
      />
      <ai-image-multi-uploader-new
        v-if="isEditing && !enableCropper"
        v-show="innerLimit > 0"
        icon="plus"
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
import AiImagePlayer from "./AiImagePlayer.vue";
import AiImageUploaderNew from "./AiImageUploaderNew.vue";
import AiImageMultiUploaderNew from "./AiImageMultiUploaderNew.vue";

@Component({
  name: "ai-image",
  components: {
    AiImagePlayer,
    AiImageMultiUploaderNew,
  },
})
export default class Home extends Mixins(SyncMixin) {
  @Prop({ type: String, default: "media" }) kind: string;
  @Prop({ type: Array, default: null }) medias: any;
  @Prop({ type: Number, default: 9 }) limit: number;
  @Prop({ type: Boolean, default: false }) isEditing: boolean;
  @Prop({ type: [String, Number], default: 0 }) merchantId: string | number;
  @Prop({ type: Boolean, default: false }) enableCropper: boolean;
  @Prop({ type: Boolean, default: false }) showAlbums: boolean;
  @Prop({ type: Array, default: null }) albums: any;

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
.ai-image {
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
