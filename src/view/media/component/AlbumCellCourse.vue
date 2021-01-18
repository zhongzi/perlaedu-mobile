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
      <div>{{ course }}</div>
    </template>
  </ai-card>
  <ai-cell
    v-else
    :cover="cover"
    :title="course"
    class="wrapper cell"
    @click:left="gotoAlbumDetail"
  >
    <template v-slot:right>
      <span v-if="isDetailMode"> {{ total }} 张 </span>
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

import _get from "lodash/get";

@Component({
  components: {
    AiCard,
    AiCell,
  },
})
export default class Home extends Mixins(SyncMixin) {
  @Prop({ type: String, default: null }) course: string;
  @Prop({ type: [String, Number], default: null }) merchantId: string | number;
  @Prop({ type: String, default: "slider" }) mode: string;
  @Prop({ type: Number, default: 0 }) total: number;

  get album() {
    return _get(this.list, "[0]");
  }

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

  get links() {
    return _get(this.album, "top3") || [];
  }

  created() {
    this.store = "mediaAlbum";
    this.loadAlbum();
  }

  @Watch("course", { deep: true })
  onStudentChanged() {
    this.loadAlbum();
  }

  @Watch("merchantId", { deep: true })
  onMerchangIdChanged() {
    this.loadAlbum();
  }

  loadAlbum() {
    if (!this.course || !this.merchantId) return;

    this.loadList({
      query: {
        merchant_id: this.merchantId,
        title: this.course,
        type: "course",
        extras: JSON.stringify({
          MediaAlbum: ["top3", "cover"],
          MediaLink: ["media"],
          Media: ["url"],
        }),
      },
    });
  }

  gotoAlbumDetail() {
    if (this.isDetailMode) return;

    this.$router.push({
      name: "mediaAlbum",
      params: {
        albumId: _get(this.album, "id", this.course),
      },
      query: {
        type: "course",
        merchantId: this.merchantId as string,
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
  padding: 5px;
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
