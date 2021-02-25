<template>
  <ai-card
    v-if="isSliderMode"
    class="wrapper card"
    @click.native="gotoAlbumDetail"
    :cover="cover | alioss({ width: 100 })"
  >
    <template v-slot:footer>
      <div>{{ title }}</div>
    </template>
  </ai-card>
  <ai-cell
    v-else
    class="wrapper cell"
    :cover="cover | alioss({ width: 100 })"
    :title="title"
    :showIcon="showIcon"
    :showBottomLine="!isDetailMode"
    @click.native="gotoAlbumDetail"
  >
    <template v-slot:right>
      <div class="actions-in-detail" v-if="isDetailMode">
        <span class="count"> {{ total }} 张 </span>
        <template v-if="isEditable">
          <album-add-entry :album="album" />
          <i class="iconfont icon-shanchu" @click="removeAlbum" />
        </template>
      </div>
      <template v-else>
        <img
          v-for="link in links"
          :src="link.media.url | alioss({ width: 100 })"
          :key="link.id"
          class="preview"
        />
      </template>
    </template>
  </ai-cell>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch, Mixins } from "vue-property-decorator";

import SyncMixin from "@/mixin/SyncMixin";

import AiCard from "@/view/component/AiCard.vue";
import AiCell from "@/view/component/AiCell.vue";

import photo from "./Photo.vue";
import AlbumAddEntry from "./AlbumAddEntry.vue";

import _get from "lodash/get";

@Component({
  components: {
    AiCard,
    AiCell,
    AlbumAddEntry,
  },
})
export default class Home extends Mixins(SyncMixin) {
  @Prop({ type: Object, default: null }) album: any;
  @Prop({ type: [String, Number], default: null }) merchantId: string | number;
  @Prop({ type: String, default: "slider" }) mode: string;
  @Prop({ type: Number, default: 0 }) total: number;
  @Prop({ type: Boolean, default: false }) isEditable: boolean;

  get showIcon() {
    return this.$route.name === "mediaAlbumsSearch";
  }

  get isSliderMode() {
    return this.mode === "slider";
  }

  get isDetailMode() {
    return this.mode === "detail";
  }

  get cover() {
    return _get(this.album, "cover");
  }

  get title() {
    return _get(this.album, "title");
  }

  get links() {
    return _get(this.album, "top3") || [];
  }

  removeAlbum() {
    this.$hui.confirm.show({
      title: "删除确认",
      message: "确认删除当前相册? 本操作不可恢复，请慎重选择!",
      confirmText: "确认",
      cancelText: "取消",
      onConfirm: () => {
        this.deleteEntity({
          store: "mediaAlbum",
          id: this.album.id,
          success: () => {
            this.$bus.$emit("albums:refresh");
            this.$nextTick(() => {
              this.$router.go(-1);
            });
          },
        });
      },
      onCancel: () => {},
    });
  }

  gotoAlbumDetail() {
    if (this.isDetailMode) return;

    this.$router.push({
      name: "mediaAlbum",
      params: {
        albumId: this.album.id,
      },
      query: {
        type: "album",
      },
    });
  }

  gotoPhotoDetail(link) {
    this.$router.push({
      name: "mediaPhoto",
      params: {
        linkId: link.id,
      },
    });
  }
}
</script>
<style lang="scss" scoped>
.card {
  margin-bottom: 10px;

  & ::v-deep .ai-card__header {
    height: 60px !important;
    max-height: initial !important;
    background: rgba(216, 216, 216, 0.19);
    border-radius: 6px;
    padding: 0px !important;
    margin: 0px;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  & ::v-deep .ai-card__footer {
    div {
      background: #fff;
      padding: 5px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      color: #000;
    }
  }
}
.cell {
  width: 100%;
  background: #fff;
  padding: 5px 10px;
  margin: 5px 0px;

  & ::v-deep .ai-cell__left-cover {
    width: 50px;
    min-width: 50px;
    height: 40px;

    img {
      width: auto;
      max-width: 100%;
      max-height: 100%;
      margin: auto;
      border-radius: 8px;
      object-fit: cover;
    }
  }

  .preview {
    display: inline-block;
    margin: 0px 5px;
    width: 30px;
    height: 30px;
    object-fit: cover;
    border-radius: 4px;
  }

  .count {
    font-size: 16px;
    min-width: 50px;
  }

  .actions-in-detail {
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: #000;

    i {
      font-size: 20px;
    }
    & > i {
      margin-left: 10px;
    }

    span {
      margin-right: 10px;
    }
  }
}
</style>
