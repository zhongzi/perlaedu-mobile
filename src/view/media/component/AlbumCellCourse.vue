<template>
  <ai-card
    class="wrapper card"
    v-if="isSliderMode"
    @click.native="gotoAlbumDetail"
    :cover="cover | alioss({ width: 100 })"
  >
    <template v-slot:footer>
      <div>{{ course }}</div>
    </template>
  </ai-card>
  <ai-cell
    v-else
    :cover="cover"
    :title="course"
    :showIcon="showIcon"
    class="wrapper cell"
    :showBottomLine="!isDetailMode"
    @click.native="gotoAlbumDetail"
  >
    <template v-slot:right>
      <span v-if="isDetailMode" class="count"> {{ total }} 张 </span>
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

  get showIcon() {
    return this.$route.name === "mediaAlbumsSearch";
  }

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
    return _get(this.album, "cover");
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
    color: #000;
  }
}
</style>
