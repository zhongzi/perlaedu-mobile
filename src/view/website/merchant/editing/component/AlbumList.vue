<template>
  <ai-section class="wrapper editing-teachers" :title="title || '学校相册'">
    <ai-list-stored
      resource="album"
      :query="innerQuery"
      :refresh.sync="refresh"
      scrollType="slider"
      :enableEmpty="false"
      :sliderOptions="{ slidesPerView: 1.7, spaceBetween: 20 }"
      :enableSlideBefore="true"
      class="list"
    >
      <template v-slot:slide-before>
        <album-add-entry
          :merchant="merchant"
          @refresh="refresh = true"
          class="entry"
        />
      </template>
      <template v-slot:item="{ item, tag, index }">
        <ai-button-float-delete @delete="onDelete(item, tag)" class="item">
          <album :album="item" routeName="websiteEditingAlbum" />
          <action-sequence-update
            v-if="index > 0"
            class="sequence"
            resource="album"
            :target="item"
            @refresh="refresh = true"
          />
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
import ActionSequenceUpdate from "./ActionSequenceUpdate.vue";

import merge from "lodash/merge";

@Component({
  components: {
    AiListStored,
    AiSection,
    AiButtonFloatDelete,
    Album,
    AlbumAddEntry,
    ActionSequenceUpdate,
  },
})
export default class Home extends Mixins(SyncMixin) {
  @Prop({ type: Object, default: null }) query: any;
  @Prop({ type: Object, default: null }) merchant: any;
  @Prop({ type: String, default: null }) title: string;

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

  created() {
    this.store = "album";
  }

  onDelete(album, tag) {
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
    justify-content: space-between;
  }

  & ::v-deep .ai-section__header {
    margin-left: 20px;
  }

  .entry {
    margin-left: 20px;
  }

  .list {
    overflow-x: scroll;
    flex: 1;
  }
  .sequence {
    position: relative;
    top: 5px;
  }
}
</style>
