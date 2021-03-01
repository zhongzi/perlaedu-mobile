<template>
  <div class="wrapper photo-uploader">
    <div class="photo">
      <template v-if="!isCreation">
        <photo
          class="photo-cell"
          v-if="innerMedias[0]"
          :photo="innerMedias[0]"
          :enabledClickToDetail="false"
          :showMerged="false"
        />
      </template>
      <div v-else class="medias">
        <template v-for="media in innerMedias">
          <div class="media" :key="media.id">
            <photo
              class="photo-cell"
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
          class="media photo-plus"
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
      emptyText=""
      :limit="100"
      :query="queryFrame"
      :sliderOptions="{ slidesPerView: 5.5, spaceBetween: 5 }"
      :enableSlideBefore="true"
      :appendItems="frame"
    >
      <template v-slot:slide-before>
        <ai-state-check-mask
          :checked="!curFrame"
          :enableCancel="false"
          @update:checked="saveFrame()"
        >
          <div class="frame-none">无</div>
        </ai-state-check-mask>
      </template>
      <template v-slot:item="{ item }">
        <ai-state-check-mask
          :key="item.id"
          :checked="curFrame && curFrame.id === item.id"
          :enableCancel="false"
          @update:checked="saveFrame(item)"
        >
          <img class="frame" :src="item.url | alioss({ width: 100 })" />
        </ai-state-check-mask>
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
import AiStateCheckMask from "@/view/component/AiStateCheckMask.vue";

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
import isEqual from "lodash/isEqual";

@Component({
  components: {
    AiImageMultiUploader,
    AiImageUploader,
    AiListStored,
    AiStateCheckMask,
    Photo,
  },
})
export default class Home extends Mixins(SyncMixin) {
  @Prop({ type: Array, default: null }) medias: any;
  @Prop({ type: Object, default: null }) frame: any;

  curFrame: any = null;
  innerMedias: any = [];

  get isCreation() {
    return this.$route.params.mediaId === "new";
  }

  get queryFrame() {
    const query: any = {
      sort: "id desc",
    };
    if (this.frame) {
      query.id = `!=${this.frame.id}`;
    }
    return query;
  }

  created() {
    this.resetMedias();
  }

  @Watch("medias", { deep: true })
  onMediaChanged() {
    this.resetMedias();
  }

  @Watch("innerMedias", { deep: true })
  onMediasChanged(newVal, oldVal) {
    this.$bus.$emit("media:mutil:uploaded", this.innerMedias);
  }

  resetMedias() {
    console.log("resetMedias");
    if (!isEmpty(this.medias) && !isEqual(this.innerMedias, this.medias)) {
      this.innerMedias = cloneDeep(this.medias);
      this.curFrame = this.medias[0].frame;
    }
  }

  uploadedMultiple(files) {
    if (isEmpty(files)) return;

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
          if (!find(this.innerMedias || [], (item) => item.id === media.id)) {
            this.innerMedias = concat(this.innerMedias || [], media);
          }
        });
      },
    });
  }

  removeMedia(media) {
    this.innerMedias = filter(this.innerMedias, (item) => item.id !== media.id);
    return;
  }

  saveFrame(frame = null) {
    if (this.curFrame === frame) return;

    this.curFrame = frame;
    this.save();
  }

  save() {
    if (isEmpty(this.innerMedias)) return;

    this.saveEntity({
      store: "media",
      query: {
        extras: "frame,file",
      },
      res: map(this.innerMedias, (media) => {
        return {
          id: media.id,
          frame_id: _get(this.curFrame, "id", 0),
        };
      }),
      success: (resp) => {
        this.innerMedias = cloneDeep(resp.data);
      },
    });
  }
}
</script>
<style lang="scss" scoped>
.photo-uploader {
  .photo-cell {
    width: 80vw;
    height: 40vh;
    margin: 0px auto;
  }
  .medias {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    padding: 10px;

    .photo-cell {
      width: 80px;
      height: 80px;
      margin: 10px;
    }

    .photo-plus {
      padding: 10px;
    }

    .media {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;

      width: 33.33%;

      .trash {
        margin: 10px;
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
    & ::v-deep .ai-slider__swiper-item:nth-child(1) {
      margin-left: 20px;
    }

    .frame-none {
      width: 60px;
      height: 60px;

      display: flex;
      align-items: center;
      justify-content: center;
      border: 3px solid #e0dddd;
      border-radius: 10px;

      font-size: 16px;
      color: #b5b5b5;
    }

    .frame {
      display: block;
      width: 60px;
      height: 60px;
      border-radius: 10px;
    }
    .is-selected {
      box-shadow: 0px 0px 10px red;
    }
  }
}
</style>
