<template>
  <div class="wrapper photos">
    <ai-list-stored
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
          :prefix="'websites/' + album.merchant_id + '/photos'"
        />
      </template>
      <template v-slot:item="{ item, tag }">
        <ai-button-float-delete @delete="onDelete(item, tag)">
          <album-photo :photo="item" />
        </ai-button-float-delete>
      </template>
    </ai-list-stored>
    <hui-popup v-model="showPopup" direction="right">
      <div class="popup">
        <ai-image-uploader
          class="cover"
          v-model="photo.cover"
          type="merchant"
          :prefix="'websites/' + album.merchant_id + '/photos'"
        />
        <div class="fields">
          <ai-input-borderless
            class="field"
            label="相片标题"
            v-model="photo.title"
          />
          <ai-input-borderless
            class="field"
            label="相片备注"
            v-model="photo.remark"
          />
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
import AiInputBorderless from "@/view/component/AiInputBorderless.vue";
import AiSubmitActions from "@/view/component/AiSubmitActions.vue";
import AiButtonFloatDelete from "@/view/component/AiButtonFloatDelete.vue";
import AiImageMultiUploader from "@/view/component/AiImageMultiUploader.vue";

import AlbumPhoto from "../../../component/AlbumPhoto.vue";

import cloneDeep from "lodash/cloneDeep";
import merge from "lodash/merge";
import map from "lodash/map";

@Component({
  components: {
    AiListStored,
    AiImageUploader,
    AiInputBorderless,
    AiSubmitActions,
    AiButtonFloatDelete,
    AlbumPhoto,
    AiImageMultiUploader,
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

  .popup {
    padding: 20px;
  }
}
</style>
