<template>
  <ai-section class="wrapper editing-teachers" title="学校相册">
    <album-add-entry :merchant="merchant" @refresh="refresh = true" />
    <ai-list-stored
      resource="album"
      :query="innerQuery"
      :refresh.sync="refresh"
      scrollType="slider"
      :enableEmpty="false"
      :sliderOptions="{ slidesPerView: 0.9, spaceBetween: 20 }"
      class="list"
    >
      <template v-slot:item="{ item, tag }">
        <ai-button-float-delete @delete="onDelete(item, tag)" class="item">
          <album :album="item" routeName="websiteEditingAlbum" />
        </ai-button-float-delete>
      </template>
    </ai-list-stored>
  </ai-section>
</template>

<script lang="ts">
import { Component, Vue, Prop, Mixins } from "vue-property-decorator";

import SyncMixin from "@/mixin/SyncMixin";

import AiListStored from "@/view/component/AiListStored.vue";
import AiSection from "@/view/component/AiSection.vue";
import AiButtonFloatDelete from "@/view/component/AiButtonFloatDelete.vue";

import Album from "@/view/website/component/Album.vue";

import AlbumAddEntry from "./AlbumAddEntry.vue";

import merge from "lodash/merge";

@Component({
  components: {
    AiListStored,
    AiSection,
    AiButtonFloatDelete,
    Album,
    AlbumAddEntry,
  },
})
export default class Home extends Mixins(SyncMixin) {
  @Prop({ type: Object, default: null }) query: any;
  @Prop({ type: Object, default: null }) merchant: any;

  refresh: boolean = false;

  get innerQuery() {
    return merge(
      {
        merchant_id: this.merchant && this.merchant.id,
        extras: "teacher",
      },
      this.query || {}
    );
  }

  onDelete(album, tag) {
    this.store = "album";
    this.id = album.id;
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
}
</script>
<style lang="scss" scoped>
.editing-teachers {
  & ::v-deep .ai-section__body {
    display: flex;
    align-items: center;
  }

  .list {
    overflow-x: scroll;
  }
}
</style>
