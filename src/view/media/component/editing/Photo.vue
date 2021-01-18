<template>
  <div class="wrapper photo-uploader">
    <div class="photo">
      <ai-image-uploader
        type="media"
        :value="innerMedia.url"
        :flag="false"
        @input:file="uploaded"
      >
        <template v-slot:preview v-if="innerMedia.url">
          <photo
            :photo="innerMedia"
            :enabledClickToDetail="false"
            :showMerged="false"
          />
        </template>
      </ai-image-uploader>
    </div>
    <ai-list-stored
      class="frames"
      resource="mediaFrame"
      scrollType="slider"
      :sliderOptions="{ slidesPerView: 4.5, spaceBetween: 10 }"
      :enableSlideBefore="true"
    >
      <template v-slot:slide-before>
        <div
          :class="['frame-none', { 'is-selected': !innerMedia.frame_id }]"
          @click="selectedFrame()"
        >
          无
        </div>
      </template>
      <template v-slot:item="{ item }">
        <img
          :class="['frame', { 'is-selected': item.id === innerMedia.frame_id }]"
          :src="item.url"
          :key="item.id"
          @click="selectedFrame(item)"
        />
      </template>
    </ai-list-stored>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Mixins, Watch } from "vue-property-decorator";

import SyncMixin from "@/mixin/SyncMixin";

import AiImageUploader from "@/view/component/AiImageUploader.vue";
import AiListStored from "@/view/component/AiListStored.vue";

import Photo from "../Photo.vue";

import _get from "lodash/get";

@Component({
  components: {
    AiImageUploader,
    AiListStored,
    Photo,
  },
})
export default class Home extends Mixins(SyncMixin) {
  @Prop({ type: Object, default: null }) media: any;

  innerMedia: any = {};

  get isUploaded() {
    return this.innerMedia.file_id && this.innerMedia.file_id > 0;
  }

  created() {
    this.resetInnerMedia();
  }

  @Watch("media", { deep: true })
  onMediaChanged() {
    this.resetInnerMedia();
  }

  resetInnerMedia() {
    this.innerMedia = {
      id: _get(this.media, "id"),
      file_id: _get(this.media, "file_id"),
      url: _get(this.media, "url"),
      frame_id: _get(this.media, "frame_id"),
      frame: _get(this.media, "frame"),
      file: _get(this.media, "file"),
    };
  }

  uploaded(url, file) {
    this.innerMedia.url = file.url;
    this.innerMedia.file = file;
    this.innerMedia.file_id = file.id;
    this.save();
  }

  selectedFrame(frame = null) {
    if (!this.isUploaded) {
      this.$hui.toast.info("请先上传作品");
      return;
    }
    this.innerMedia.frame = frame;
    this.innerMedia.frame_id = _get(frame, "id", 0);
    this.save();
  }

  save() {
    this.saveEntity({
      store: "media",
      id: this.innerMedia.id,
      res: this.innerMedia,
      success: (resp) => {
        if (!this.innerMedia.id) {
          this.$emit("refresh", resp.data.id);
        }
      },
    });
  }
}
</script>
<style lang="scss" scoped>
.photo-uploader {
  .frames {
    .frame-none {
      width: 60px;
      height: 60px;
      margin: 10px 0px;
      margin-left: 10px;

      display: flex;
      align-items: center;
      justify-content: center;
      border: 3px solid #e0dddd;
      border-radius: 10px;
    }

    .frame {
      display: block;
      width: 60px;
      height: 60px;
      margin: 10px 0px;
      border-radius: 10px;
    }
    .is-selected {
      box-shadow: 0px 0px 10px red;
    }
  }
}
</style>
