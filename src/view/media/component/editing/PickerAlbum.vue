<template>
  <div class="wrapper picker-album">
    <picker-links
      title="作品标签"
      logoKey="target.cover"
      titleKey="target.title"
      :refresh.sync="refresh"
      :query="query"
      @click:item:delete="removeLink"
      @click:item:plus="open = true"
    />
    <ly-picker-media-album
      :open.sync="open"
      :query="mediaAlbumQuery"
      @selected="addAlbumAndLinks"
      @click:create="onClickCreate"
    />
    <ai-dialog v-model="openDialog">
      <div class="dialog">
        <ai-input v-model="title" placeholder="输入新标签名称" />
        <ai-submit-actions @cancel="openDialog = false" @submit="addNewAlbum">
        </ai-submit-actions>
      </div>
    </ai-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Mixins, Prop } from "vue-property-decorator";
import SyncMixin from "@/mixin/SyncMixin";

import AiDialog from "@/view/component/AiDialog.vue";
import AiInput from "@/view/component/AiInput.vue";
import AiSubmitActions from "@/view/component/AiSubmitActions.vue";

import PickerLinks from "./PickerLinks.vue";
import LyPickerMediaAlbum from "@/view/layout/component/PickerMediaAlbum.vue";

import map from "lodash/map";
import isEmpty from "lodash/isEmpty";
import isString from "lodash/isString";

@Component({
  components: {
    AiDialog,
    AiInput,
    AiSubmitActions,
    PickerLinks,
    LyPickerMediaAlbum,
  },
})
export default class Home extends Mixins(SyncMixin) {
  @Prop({ type: Object, default: null }) media: any;

  open = false;
  openDialog = false;
  refresh = false;
  title = "";

  get query() {
    return {
      media_id: this.media.id,
      target_class: "MediaAlbum",
      "target_id.MediaAlbum.type": "default",
      extras: JSON.stringify({
        MediaLink: ["target"],
        MediaAlbum: ["cover"],
      }),
    };
  }

  get mediaAlbumQuery() {
    return {
      type: "default",
    };
  }

  created() {
    this.store = "mediaLink";
  }

  onClickCreate() {
    this.open = false;
    this.openDialog = true;
  }

  removeLink(link) {
    this.deleteEntity({
      id: link.id,
      success: () => {
        this.refresh = true;
      },
    });
  }

  addNewAlbum() {
    if (isEmpty(this.title)) {
      this.$hui.toast.error("请输入标签名称");
      return;
    }
    this.addAlbumAndLinks(this.title);
    this.title = "";
  }

  addAlbumAndLinks(albums) {
    if (isString(albums)) {
      this.saveEntity({
        store: "mediaAlbum",
        res: {
          title: albums,
        },
        success: (resp) => {
          this.saveLinks([resp.data]);
        },
      });
    } else {
      this.saveLinks(albums);
    }
  }

  saveLinks(albums) {
    this.saveEntity({
      res: map(albums, (album) => {
        return {
          target_class: "MediaAlbum",
          target_id: album.id,
          media_id: this.media.id,
        };
      }),
      success: () => {
        this.open = false;
        this.openDialog = false;
        this.refresh = true;
      },
    });
  }
}
</script>
<style lang="scss" scoped>
.dialog {
  padding: 40px;
}
</style>
