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
          :photo="item.media"
          :link="item"
          :key="item.id"
          :showInfo="true"
          class="item"
        />
      </template>
    </ai-list-stored>
    <div>
      <div class="actions">
        <div class="action" @click="open = true">
          <i class="iconfont icon-pc" />
          <span> 跨屏展示 </span>
        </div>
        <div class="action" @click="autoPlayEnabled = !autoPlayEnabled">
          <i class="iconfont icon-video" />
          <span> {{ !autoPlayEnabled ? "开启" : "关闭" }}自动滚动 </span>
        </div>
      </div>
      <ai-copyright :manual="true" />
    </div>
    <ai-dialog v-model="open">
      <div class="dialog">
        <img :src="qrcodeURL" />
        <span> 扫码即可查看本画廊 </span>
      </div>
    </ai-dialog>
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
  autoPlayEnabled = false;
  open = false;

  get sliderOptions() {
    return {
      slidesPerView: "auto",
      freeMode: false,
      centeredSlides: true,
      loop: true,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
        playAtStart: false,
      },
    };
  }

  get query() {
    let query = cloneDeep(this.$route.query || {});
    if (isEmpty(query)) {
      query.merchant_id = _get(this.$auth, "user.curr_merch_id");
    }
    query.extras = JSON.stringify({
      MediaLink: ["media"],
      Media: ["file", "url", "frame", "count_star"],
    });
    return query;
  }

  get qrcodeURL() {
    return this.$tools.makeQrcode();
  }

  created() {
    this.trigger();
  }

  @Watch("autoPlayEnabled")
  onAutoPlayEnabledChanged() {
    this.trigger();
  }

  trigger() {
    this.$bus.$emit("swiper:autolay", this.autoPlayEnabled);
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

  .actions {
    display: flex;
    align-items: center;
    justify-content: center;

    .action {
      margin: 0px 10px;

      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      line-height: 1.2;

      i {
        font-size: 32px;
      }
      span {
        font-size: 13px;
      }
    }
  }
}
.dialog {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  padding: 20px;

  img {
    width: 100%;
  }
  span {
    font-size: 13px;
  }
}
</style>
