<template>
  <ai-list-stored
    class="wrapper albums"
    resource="group"
    :scrollType="scrollType"
    :query="query"
    :hideIfNoData="true"
    :sliderOptions="{ slidesPerView: 3.5, spaceBetween: 10 }"
  >
    <template v-slot:header v-if="isSliderMode">
      <div class="header">
        <div class="title">班级相册</div>
        <div class="more" @click="gotoSearch">
          <span>查看全部</span>
          <i class="iconfont icon-direction" />
        </div>
      </div>
    </template>
    <template v-slot:item="{ item }">
      <album-cell-group
        :group="item"
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

import AlbumCellGroup from "./AlbumCellGroup.vue";

import isEmpty from "lodash/isEmpty";

@Component({
  components: {
    AiListStored,
    AlbumCellGroup,
  },
})
export default class Home extends Vue {
  @Prop({ type: [String, Number], default: null }) merchantId: string | number;
  @Prop({ type: String, default: "slider" }) scrollType: string;
  @Prop({ type: String, default: null }) keyword: string;

  get isSliderMode() {
    return this.scrollType === "slider";
  }

  get query() {
    const query: any = {
      merchant_id: this.merchantId,
    };
    if (!isEmpty(this.keyword)) {
      query.filters = JSON.stringify({
        name: [this.keyword],
      });
    }
    return query;
  }

  gotoSearch() {
    this.$router.push({
      name: "mediaAlbumsSearch",
      query: {
        type: "group",
      },
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
