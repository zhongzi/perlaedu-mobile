<template>
  <div class="wrapper photos">
    <ai-list-stored
      class="container"
      resource="albumPhoto"
      :query="innerQuery"
      :refresh.sync="refresh"
      :gap="20"
      :loading="false"
      scrollType="waterfall"
    >
      <template v-slot:header>
        <slot name="header" />
        <ai-image-multi-uploader
          @input="savePhotos"
          type="merchant"
          :prefix="album.merchant_id + '/albums/' + album.id + '/photos'"
        />
      </template>
      <template v-slot:item="{ item, tag, index }">
        <ai-button-float-delete @delete="onDelete(item, tag)" class="photo">
          <album-photo :photo="item" />
          <album-cover-action :photo="item" :album="album" class="cover" />
          <action-sequence-update
            v-if="index > 0"
            resource="albumPhoto"
            :target="item"
            @refresh="refresh = true"
            class="sequence"
          />
        </ai-button-float-delete>
      </template>
    </ai-list-stored>
    <hui-popup v-model="showPopup" direction="right">
      <div class="popup">
        <ai-image-uploader
          class="cover"
          v-model="photo.cover"
          type="merchant"
          :prefix="album.merchant_id + '/albums/' + album.id + '/photos'"
        />
        <div class="fields">
          <ai-input class="field" label="相片标题" v-model="photo.title" />
          <ai-input class="field" label="相片备注" v-model="photo.remark" />
        </div>
        <ai-submit-actions @cancel="onCancel" @submit="onSubmit" />
      </div>
    </hui-popup>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Mixins } from "vue-property-decorator";

import SyncMixin from "@/mixin/SyncMixin";

import AiListStored from "@/view/component/AiListStored.vue";
import AiImageUploader from "@/view/component/AiImageUploader.vue";
import AiInput from "@/view/component/AiInput.vue";
import AiSubmitActions from "@/view/component/AiSubmitActions.vue";
import AiButtonFloatDelete from "@/view/component/AiButtonFloatDelete.vue";
import AiImageMultiUploader from "@/view/component/AiImageMultiUploader.vue";

import AlbumPhoto from "../../../component/AlbumPhoto.vue";
import AlbumCoverAction from "./AlbumCoverAction.vue";
import ActionSequenceUpdate from "./ActionSequenceUpdate.vue";

import cloneDeep from "lodash/cloneDeep";
import merge from "lodash/merge";
import map from "lodash/map";

@Component({
  components: {
    AiListStored,
    AiImageUploader,
    AiInput,
    AiSubmitActions,
    AiButtonFloatDelete,
    AlbumPhoto,
    AiImageMultiUploader,
    AlbumCoverAction,
    ActionSequenceUpdate,
  },
})
export default class Home extends Mixins(SyncMixin) {
  @Prop({ type: Object, default: null }) album: any;

  refresh: boolean = false;
  showPopup: boolean = false;
  photo: any = {};

  created() {
    this.store = "albumPhoto";
  }

  get innerQuery() {
    return {
      album_id: this.album.id,
    };
  }

  savePhotos(urls) {
    this.saveEntity({
      res: map(urls, (url) => {
        return {
          merchant_id: this.album.merchant_id,
          album_id: this.album.id,
          cover: url,
        };
      }),
      success: () => {
        this.refresh = true;
      },
    });
  }

  editPhoto(photo) {
    this.photo = cloneDeep(this.photo);
    this.showPopup = true;
  }

  onDelete(photo, tag) {
    this.id = photo.id;
    this.tag = tag;
    this.deleteEntity({
      res: { id: this.id },
      success: () => {
        this.$nextTick(() => {
          this.refresh = true;
        });
      },
    });
  }

  onCancel() {
    this.showPopup = false;
  }

  onSubmit() {
    this.saveEntity({
      res: merge(this.photo, { merchant_id: this.album.merchant_id }),
      success: () => {
        this.photo = {
          title: "",
          cover: "",
          remark: "",
        };
        this.refresh = true;
        this.showPopup = false;
      },
    });
  }
}
</script>
<style lang="scss" scoped>
.photos {
  img {
    width: 100%;
  }

  & ::v-deep .ai-waterfall__waterfall {
    position: relative;
    left: -10px;
    padding: 0px 20px;
  }

  .popup {
    padding: 20px;
  }
  .photo {
    position: relative;

    .cover {
      position: absolute;
      bottom: 0px;
      left: 0px;
    }
    .sequence {
      position: absolute;
      bottom: -15px;
      left: 5px;

      & ::v-deep button {
        padding: 5px;
        height: 30px;
        border: none;
      }
    }
  }
}
</style>
