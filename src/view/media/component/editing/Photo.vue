<template>
  <div class="wrapper photo-uploader">
    <div class="photo">
      <template v-if="!isCreation">
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
      </template>
      <div v-else class="medias">
        <template v-for="media in medias">
          <div class="cell media" :key="media.id">
            <photo
              class="cell"
              :photo="media"
              :frame="curFrame"
              :showMerged="false"
              :enabledClickToDetail="false"
              :enabledPhotoFrame="false"
            />
            <div class="trash">
              <i class="iconfont icon-trash" @click="removeMedia(media)" />
            </div>
          </div>
        </template>
        <ai-image-multi-uploader
          class="cell"
          :enabledCompression="false"
          @input:file="uploadedMultiple"
        >
          <i class="iconfont icon-plus" />
        </ai-image-multi-uploader>
      </div>
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
          :class="['frame-none', { 'is-selected': !curFrame }]"
          @click="saveFrame()"
        >
          无
        </div>
      </template>
      <template v-slot:item="{ item }">
        <img
          :class="[
            'frame',
            { 'is-selected': curFrame && item.id === curFrame.id },
          ]"
          :src="item.url | alioss({ width: 100 })"
          :key="item.id"
          @click="saveFrame(item)"
        />
      </template>
    </ai-list-stored>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Mixins, Watch } from "vue-property-decorator";

import SyncMixin from "@/mixin/SyncMixin";

import AiImageMultiUploader from "@/view/component/AiImageMultiUploader.vue";
import AiImageUploader from "@/view/component/AiImageUploader.vue";
import AiListStored from "@/view/component/AiListStored.vue";

import Photo from "../Photo.vue";

import _get from "lodash/get";
import map from "lodash/map";
import uniqBy from "lodash/uniqBy";
import isEmpty from "lodash/isEmpty";
import concat from "lodash/concat";
import filter from "lodash/filter";
import cloneDeep from "lodash/cloneDeep";
import find from "lodash/find";
import forEach from "lodash/forEach";

@Component({
  components: {
    AiImageMultiUploader,
    AiImageUploader,
    AiListStored,
    Photo,
  },
})
export default class Home extends Mixins(SyncMixin) {
  @Prop({ type: Object, default: null }) media: any;

  curFrame: any = null;
  innerMedia: any = {};
  medias: any = [];

  get isCreation() {
    return this.$route.params.mediaId === "new";
  }

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

  @Watch("medias", { deep: true })
  onMediasChanged(newVal, oldVal) {
    this.$bus.$emit("media:mutil:uploaded", this.medias);
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

    this.curFrame = this.innerMedia.frame;
  }

  uploaded(url, file) {
    this.innerMedia.url = file.url;
    this.innerMedia.file = file;
    this.innerMedia.file_id = file.id;
    this.saveFrameSingle();
  }

  uploadedMultiple(files) {
    this.saveEntity({
      store: "media",
      query: {
        extras: "file,frame,url",
      },
      res: map(files, (file) => {
        return {
          file_id: file.id,
          frame_id: _get(this.curFrame, "id", 0),
        };
      }),
      success: (resp) => {
        forEach(resp.data, (media) => {
          if (!find(this.medias || [], (item) => item.id === media.id)) {
            this.medias = concat(this.medias || [], media);
          }
        });
      },
    });
  }

  removeMedia(media) {
    return (this.medias = filter(this.medias, (item) => item.id !== media.id));
  }

  saveFrame(frame = null) {
    this.curFrame = frame;
    this.isCreation ? this.saveFrameMultiple() : this.saveFrameSingle();
  }

  saveFrameMultiple() {
    if (isEmpty(this.medias)) {
      this.$hui.toast.info("请先上传作品");
      return;
    }

    this.saveEntity({
      store: "media",
      query: {
        extras: "frame,file",
      },
      res: map(this.medias, (media) => {
        return {
          id: media.id,
          frame_id: _get(this.curFrame, "id", 0),
        };
      }),
      success: (resp) => {
        this.medias = cloneDeep(resp.data);
      },
    });
  }
  saveFrameSingle(frame = null) {
    if (!this.isUploaded) {
      this.$hui.toast.info("请先上传作品");
      return;
    }
    this.innerMedia.frame = this.curFrame;
    this.innerMedia.frame_id = _get(this.curFrame, "id", 0);

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
  .medias {
    display: grid;
    padding: 10px;
    grid-template-columns: repeat(auto-fill, 33%);

    .cell {
      max-width: 100px;
      margin: 10px;
    }

    .media {
      position: relative;

      .trash {
        position: absolute;
        left: 0px;
        right: 0px;
        top: 0px;
        bottom: 0px;
        background: rgba(0, 0, 0, 0.1);

        display: flex;
        align-items: center;
        justify-content: center;

        i {
          font-size: 24px;
          color: red;
          font-size: 800;
        }
      }
    }
  }
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
