<template>
  <div :class="b()">
    <img
      :src="media.url | alioss(resizeOptions)"
      :class="b('image')"
      @click.stop="trigger(true)"
    />
    <ai-dialog :value="showDialog" v-if="showDialog" @input="trigger()">
      <div :class="b('dialog')">
        <ai-slider
          :list="medias"
          :options="swiperOptions"
          :showFlipButton="true"
          :showPagination="true"
          :enableSlideAfter="false"
          :slideToNum.sync="curSlideNum"
        >
          <template v-slot:item="{ item, index }">
            <slot name="slider" :item="item" :index="index">
              <div :class="b('dialog-item')">
                <img
                  :src="item.url | alioss(resizeOptions)"
                  @click.stop="trigger(false)"
                />
              </div>
            </slot>
          </template>
        </ai-slider>
        <div class="albums" v-if="showAlbums">
          <template v-if="joinedAlbums && joinedAlbums.length > 0">
            <template v-for="(album, index) in joinedAlbums">
              <ly-item-avatar
                class="album"
                :key="index"
                :title="getAlbumName(album)"
                :active="true"
                @click.native="removeAlbum(album)"
              />
            </template>
          </template>
          <template v-if="unjoinedAlbums && unjoinedAlbums.length > 0">
            <template v-for="(album, index) in unjoinedAlbums">
              <ly-item-avatar
                class="album"
                :key="'un-' + index"
                :title="getAlbumName(album)"
                @click.native="joinAlbum(album)"
              />
            </template>
          </template>
        </div>
      </div>
    </ai-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Mixins, Watch } from "vue-property-decorator";

import SyncMixin from "@/mixin/SyncMixin";

import AiDialog from "./AiDialog.vue";
import AiSlider from "./AiSlider.vue";

import LyItemAvatar from "@/view/layout/component/ItemAvatar.vue";

import isEmpty from "lodash/isEmpty";
import _get from "lodash/get";
import filter from "lodash/filter";
import map from "lodash/map";
import concat from "lodash/concat";
import findIndex from "lodash/findIndex";
import merge from "lodash/merge";
import find from "lodash/find";
import cloneDeep from "lodash/cloneDeep";

@Component({
  name: "ai-image-player",
  components: {
    AiDialog,
    AiSlider,
    LyItemAvatar,
  },
})
export default class Home extends Mixins(SyncMixin) {
  @Prop({ type: Object, default: null }) media: any;
  @Prop({ type: Array, default: [] }) medias: any;
  @Prop({ type: Number, default: 0 }) index: number;
  @Prop({ type: Boolean, default: false }) showAlbums: boolean;
  @Prop({ type: Array, default: null }) albums: any;

  showDialog: boolean = false;
  curSlideNum: number = null;

  cachedAlbums: any = {};

  get curMedia() {
    return this.medias[this.curSlideNum];
  }

  get cachedAlbum() {
    return _get(this.cachedAlbums, `[${this.curMedia.id}]`);
  }

  get links() {
    return _get(this.cachedAlbum, "links");
  }

  get joinedAlbums() {
    return _get(this.cachedAlbum, "joinedAlbums");
  }

  get unjoinedAlbums() {
    return _get(this.cachedAlbum, "unjoinedAlbums");
  }

  get resizeOptions() {
    return {
      width: 300,
    };
  }

  get swiperOptions() {
    return {
      curSlideNum: this.curSlideNum,
      effect: "fade",
      freeMode: false,
      autoHeight: true,
      pagination: {
        el: ".swiper-pagination",
        dynamicBullets: true,
      },
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
    };
  }

  @Watch("curSlideNum")
  onCurSlideChanged() {
    this.loadJoinedAlbums();
  }

  trigger(flag) {
    this.showDialog = flag;
    this.curSlideNum = this.index;
  }

  getAlbumName(album) {
    if (album._resource === "Group") {
      return _get(album, "name");
    } else if (album._resource === "Course") {
      return _get(album, "title");
    } else if (album._resource === "Person") {
      return _get(album, "realname");
    } else if (album._resource === "MediaAlbum") {
      return _get(album, "title");
    }
  }

  loadJoinedAlbums() {
    if (isEmpty(this.curMedia)) return;
    if (!isEmpty(this.cachedAlbum)) return;

    const mediaId = this.curMedia.id;
    this.loadEntity({
      store: "mediaLink",
      query: {
        media_id: mediaId,
        extras: "target",
      },
      success: (resp) => {
        this.resetCachedAlbums(mediaId, resp.data.data);
      },
    });
  }

  resetCachedAlbums(mediaId, links) {
    console.log(mediaId, links, this.albums);

    const joinedAlbums = map(links, (link) =>
      merge(link.target, {
        linkId: link.id,
        _resource: link.target_class,
        mediaId: link.media_id,
      })
    );

    const unjoinedAlbums = filter(
      this.albums,
      (album) =>
        !find(joinedAlbums, (ja) => {
          return (
            (ja._resource === album._resource && ja.id === album.id) ||
            (album._resource === "Course" &&
              ja._resource === "MediaAlbum" &&
              ja.title === album.title)
          );
        })
    );

    this.$set(this.cachedAlbums, mediaId, {
      links,
      joinedAlbums,
      unjoinedAlbums,
    });
    console.log(this.cachedAlbums);
  }

  joinAlbum(album) {
    if (isEmpty(this.curMedia)) return;

    const curMediaId = this.curMedia.id;
    const links = cloneDeep(this.links);

    if (album._resource === "Course") {
      this.saveEntity({
        store: "mediaLink",
        query: {
          extras: "target",
        },
        res: {
          media_id: curMediaId,
          course: album.title,
        },
        success: (resp) => {
          this.resetCachedAlbums(curMediaId, concat(links, resp.data));
        },
      });
    } else {
      this.saveEntity({
        store: "mediaLink",
        query: {
          extras: "target",
        },
        res: {
          media_id: curMediaId,
          target_id: album.id,
          target_class: album._resource,
        },
        success: (resp) => {
          this.resetCachedAlbums(curMediaId, concat(links, resp.data));
        },
      });
    }
  }

  removeAlbum(album) {
    const mediaId = album.mediaId;
    const links = _get(this.cachedAlbums, `[${mediaId}].links`);
    this.deleteEntity({
      store: "mediaLink",
      id: album.linkId,
      success: () => {
        this.resetCachedAlbums(
          mediaId,
          filter(links, (link) => link.id !== album.linkId)
        );
      },
    });
  }
}
</script>
<style lang="scss" scoped>
.ai-image-player {
  height: 100%;
  width: 100%;

  &__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.ai-image-player__dialog {
  & ::v-deep .ai-slider__swiper-item {
    height: 100%;
  }
  &-item {
    height: 100%;
    img {
      width: 100%;
    }
  }

  .albums {
    margin: 10px;
    display: flex;
    align-items: center;
    .album {
      margin: 0px 5px;
    }
  }
}
</style>
