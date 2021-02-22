<template>
  <ai-list-stored
    class="wrapper albums"
    resource="mediaAlbum"
    :scrollType="scrollType"
    :query="query"
    :refresh.sync="refresh"
    :enableSlideBefore="true"
    emptyText=""
    :sliderOptions="{ slidesPerView: 3.5, spaceBetween: 10 }"
  >
    <template v-slot:header v-if="isSliderMode">
      <div class="header">
        <div class="title">自定义相册</div>
        <div class="more" @click="gotoSearch">
          <span>查看全部</span>
          <i class="iconfont icon-direction" />
        </div>
      </div>
    </template>
    <template v-slot:slide-before v-if="isSliderMode">
      <album-add-entry :merchantId="merchantId" @refresh="refresh = true" />
    </template>
    <template v-slot:item="{ item }">
      <album-cell
        :album="item"
        :key="item.id"
        :merchantId="merchantId"
        :mode="scrollType"
      />
    </template>
  </ai-list-stored>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

import AiListStored from "@/view/component/AiListStored.vue";

import AlbumAddEntry from "./AlbumAddEntry.vue";
import AlbumCell from "./AlbumCell.vue";

import isEmpty from "lodash/isEmpty";

@Component({
  components: {
    AiListStored,
    AlbumAddEntry,
    AlbumCell,
  },
})
export default class Home extends Vue {
  @Prop({ type: [String, Number], default: null }) merchantId: string | number;
  @Prop({ type: String, default: "slider" }) scrollType: string;
  @Prop({ type: String, default: null }) keyword: string;

  refresh: boolean = false;

  get isSliderMode() {
    return this.scrollType === "slider";
  }

  get query() {
    const query: any = {
      merchant_id: this.merchantId,
      type: "default",
      extras: JSON.stringify({
        MediaAlbum: ["top3", "cover"],
        MediaLink: ["media"],
        Media: ["url"],
      }),
    };
    if (!isEmpty(this.keyword)) {
      query.filters = JSON.stringify({
        title: [this.keyword],
      });
    }
    return query;
  }

  gotoSearch() {
    this.$router.push({
      name: "mediaAlbumsSearch",
    });
  }
}
</script>
<style lang="scss" scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0px 20px;

  .title {
    font-size: 14px;
  }
  .more {
    color: #b5b5b5;
    font-size: 12px;
    font-weight: default;
    span {
      margin-right: 5px;
    }
  }
  i {
    font-size: 12px;
  }
}

.albums {
  & ::v-deep .ai-slider__swiper-item:nth-child(1) {
    margin-left: 20px;
  }
}
</style>
