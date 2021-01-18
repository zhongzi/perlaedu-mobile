<template>
  <div class="wrapper picker-album">
    <picker-items
      title="自定义相册"
      :items="albums"
      labelKey="title"
      logoKey="cover"
      @icon:delete:clicked="onClickDelete"
      @icon:plus:clicked="onClickPlus"
    />
    <ly-picker-media-album
      :open.sync="open"
      :query="query"
      @selected="addAlbums"
      @click:create="onClickCreate"
    />
    <ai-dialog v-model="openDialog">
      <div class="dialog">
        <ai-input v-model="title" placeholder="输入新标签名称" />
        <ai-submit-actions @cancel="onCancel" @submit="addNewAlbum">
        </ai-submit-actions>
      </div>
    </ai-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Mixins, Prop, Watch } from "vue-property-decorator";
import SyncMixin from "@/mixin/SyncMixin";

import AiDialog from "@/view/component/AiDialog.vue";
import AiInput from "@/view/component/AiInput.vue";
import AiSubmitActions from "@/view/component/AiSubmitActions.vue";

import PickerItems from "./PickerItems.vue";
import LyPickerMediaAlbum from "@/view/layout/component/PickerMediaAlbum.vue";

import map from "lodash/map";
import isEmpty from "lodash/isEmpty";
import isString from "lodash/isString";
import concat from "lodash/concat";
import filter from "lodash/filter";
import uniqBy from "lodash/uniqBy";

@Component({
  components: {
    AiDialog,
    AiInput,
    AiSubmitActions,
    PickerItems,
    LyPickerMediaAlbum,
  },
})
export default class Home extends Mixins(SyncMixin) {
  open = false;
  openDialog = false;
  title = "";
  albums: any = null;

  get query() {
    return {
      type: "default",
    };
  }

  @Watch("albums", { deep: true })
  onAlbumsChanged() {
    this.$emit("selected", this.albums);
  }

  onClickCreate() {
    this.open = false;
    this.openDialog = true;

    this.$nextTick(() => {
      this.$bus.$emit("ai:popup", true);
    });
  }

  onCancel() {
    this.openDialog = false;
    this.$bus.$emit("ai:popup", false);
  }

  onClickDelete(album) {
    this.albums = filter(this.albums || [], (item) => {
      return item.id !== album.id;
    });
  }

  onClickPlus() {
    this.open = true;
  }

  addNewAlbum() {
    if (isEmpty(this.title)) {
      this.$hui.toast.error("请输入标签名称");
      return;
    }
    this.createAlbum(this.title);
    this.title = "";
  }

  createAlbum(title) {
    this.saveEntity({
      store: "mediaAlbum",
      res: {
        title: title,
      },
      success: (resp) => {
        this.addAlbums([resp.data]);
        this.$bus.$emit("ai:popup", false);
      },
    });
  }

  addAlbums(albums) {
    this.albums = concat(this.albums || [], albums || []);
    this.albums = uniqBy(this.albums || [], "id");
  }
}
</script>
<style lang="scss" scoped>
.dialog {
  padding: 40px;
}
</style>
