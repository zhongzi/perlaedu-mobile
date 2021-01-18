<template>
  <ai-card
    class="wrapper card"
    v-if="isSliderMode"
    @click.native="gotoAlbumDetail"
  >
    <template v-slot:header>
      <img :src="cover" />
    </template>
    <template v-slot:footer>
      <div>{{ title }}</div>
    </template>
  </ai-card>
  <ai-cell
    v-else
    :cover="cover"
    :title="title"
    class="wrapper cell"
    @click:left="gotoAlbumDetail"
  >
    <template v-slot:right>
      <span v-if="isDetailMode" style="font-size: 16px"> {{ total }} 张 </span>
      <template v-else>
        <img
          v-for="link in links"
          :src="link.media.url"
          :key="link.id"
          class="preview"
          @click="gotoPhotoDetail(link)"
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

import _get from "lodash/get";

@Component({
  components: {
    AiCard,
    AiCell,
  },
})
export default class Home extends Mixins(SyncMixin) {
  @Prop({ type: Object, default: null }) album: any;
  @Prop({ type: [String, Number], default: null }) merchantId: string | number;
  @Prop({ type: String, default: "slider" }) mode: string;
  @Prop({ type: Number, default: 0 }) total: number;

  get isSliderMode() {
    return this.mode === "slider";
  }

  get isDetailMode() {
    return this.mode === "detail";
  }

  get cover() {
    return (
      _get(this.album, "cover") ||
      require("@/asset/image/media-album-empty.jpg")
    );
  }

  get title() {
    return _get(this.album, "title");
  }

  get links() {
    return _get(this.album, "top3") || [];
  }

  gotoAlbumDetail() {
    if (this.isDetailMode) return;

    this.$router.push({
      name: "mediaAlbum",
      params: {
        albumId: this.album.id,
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
  & ::v-deep .ai-card__footer {
    div {
      padding: 0px 5px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  & ::v-deep .ai-card__header {
    padding: 3px;
    height: 50px;
    min-height: 50px;
    max-height: 50px;

    img {
      max-height: 100%;
    }
  }
}
.cell {
  width: 100%;
  background: #fff;
  border-radius: 10px;
  padding: 5px 10px;
  margin: 10px 0px;

  & ::v-deep .ai-cell__left-cover {
    width: 60px;
    max-width: 60px;

    height: 50px;
    min-height: 50px;
    max-height: 50px;

    img {
      width: auto;
      max-width: 100%;
      max-height: 100%;
      margin: auto;
    }
  }

  .preview {
    display: inline-block;
    margin: 0px 5px;
    width: 30px;
  }
}
</style>
