<template>
  <div class="wrapper album-player">
    <ai-list-stored
      class="photos"
      resource="mediaLink"
      scrollType="slider"
      :query="query"
      :enableSlideAfter="false"
      :sliderOptions="sliderOptions"
    >
      <template v-slot:item="{ item }">
        <photo
          class="item"
          :style="{ padding: item.frame && '5vw' }"
          :photo="item.media"
          :link="item"
          :key="item.id"
          :showInfo="true"
        />
      </template>
    </ai-list-stored>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";

import AiListStored from "@/view/component/AiListStored.vue";
import AiCard from "@/view/component/AiCard.vue";
import AiDialog from "@/view/component/AiDialog.vue";
import AiCopyright from "@/view/component/AiCopyright.vue";
import AiFixedFooter from "@/view/component/AiFixedFooter.vue";

import Photo from "./component/Photo.vue";

import _get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import cloneDeep from "lodash/cloneDeep";

@Component({
  components: {
    AiListStored,
    AiCard,
    AiDialog,
    AiCopyright,
    AiFixedFooter,
    Photo,
  },
})
export default class Home extends Vue {
  get sliderOptions() {
    return {
      slidesPerView: "auto",
      freeMode: false,
      centeredSlides: true,
      loop: true,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
      },
    };
  }

  get query() {
    let query = cloneDeep(this.$route.query || {});

    if (isEmpty(query)) {
      query.merchant_id = _get(this.$auth, "user.curr_merch_id");
    }
    query.is_deleted_tmp = false;
    query.sort = "id desc";
    query.extras = JSON.stringify({
      MediaLink: ["media"],
      Media: ["file", "url", "frame", "count_star", "merchant"],
    });
    return query;
  }
}
</script>
<style lang="scss" scoped>
.album-player {
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .photos {
    flex: 1;

    & ::v-deep .ai-slider__swiper {
      height: 100%;
    }

    & ::v-deep .ai-slider__swiper-item {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .item {
      width: 100vw;
      height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      & ::v-deep .cell {
        flex: 1;
        max-height: 80%;

        img {
          width: auto;
          max-width: 100%;
          max-height: 100%;
        }
      }
    }
  }
}
</style>
