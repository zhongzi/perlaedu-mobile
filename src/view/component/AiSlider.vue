<template>
  <div :class="b()">
    <div :class="b('header')">
      <slot name="header">
        {{ title }}
      </slot>
    </div>
    <swiper
      :class="b('swiper')"
      ref="mySwiper"
      :options="swiperOptions"
      @ready="onReady"
      @reachEnd="onReachEnd"
      @slideChange="onSlideChanged"
    >
      <swiper-slide :class="b('swiper-item')" v-if="enableSlideBefore">
        <slot name="slide-before" />
      </swiper-slide>
      <template v-if="list && list.length > 0">
        <swiper-slide
          :class="b('swiper-item')"
          v-for="(item, index) in list"
          :key="item.id || index"
        >
          <slot name="item" :item="item" :index="index" />
        </swiper-slide>
      </template>
      <swiper-slide v-else :class="b('swiper-item')">
        <slot name="empty"> 暂无数据 </slot>
      </swiper-slide>
      <swiper-slide :class="b('swiper-item')" v-if="enableSlideAfter">
        <slot name="slide-after" />
      </swiper-slide>
      <div
        class="swiper-pagination swiper-pagination-white"
        slot="pagination"
        v-if="showPagination"
      ></div>
      <div
        class="swiper-button-prev swiper-button-white"
        slot="button-prev"
        v-if="showFlipButton"
      ></div>
      <div
        class="swiper-button-next swiper-button-white"
        slot="button-next"
        v-if="showFlipButton"
      ></div>
    </swiper>
    <div :class="b('footer')">
      <slot name="footer" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import "swiper/swiper-bundle.css";
import { Swiper, SwiperSlide } from "vue-awesome-swiper";

import _get from "lodash/get";
import merge from "lodash/merge";

@Component({
  name: "ai-slider",
  components: {
    Swiper,
    SwiperSlide,
  },
})
export default class Home extends Vue {
  @Prop({ type: String, default: null }) title: string;
  @Prop({ type: Array, default: [] }) list: any;
  @Prop({ type: Boolean, default: false }) showPagination: boolean;
  @Prop({ type: Boolean, default: false }) showFlipButton: boolean;
  @Prop({ type: Boolean, default: false }) enableSlideBefore: boolean;
  @Prop({ type: Boolean, default: true }) enableSlideAfter: boolean;
  @Prop({ type: Object, default: () => ({}) }) options: object;
  @Prop({ type: Number, default: 0 }) slideToNum: number;
  @Prop({ type: Number, default: 3 }) distance: number;

  get swiperOptions() {
    return merge(
      {
        spaceBetween: 0,
        freeMode: true,
        autoHeight: true,
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
        },
      },
      this.options
    );
  }

  get swiper() {
    return (this.$refs.mySwiper as any).$swiper;
  }

  @Watch("slideToNum", { deep: true })
  onSlideToNumChanged() {
    this.initSlidePage();
  }

  created() {
    this.$bus.$on("swiper:autolay", (running) => {
      if (!this.swiper.autoplay) return;

      if (running) {
        this.swiper.autoplay.start();
      } else {
        this.swiper.autoplay.stop();
      }
    });
  }

  mounted() {
    this.initSlidePage();
  }

  initSlidePage() {
    this.swiper && this.swiper.slideTo(this.slideToNum, 1000, false);
  }

  onReady() {
    if (!_get(this.swiperOptions, "autoplay.playAtStart", true)) {
      this.swiper.autoplay.stop();
    }
  }

  onSlideChanged() {
    this.$emit("update:slideToNum", this.swiper.realIndex);
    console.log(
      this.swiper.realIndex,
      this.distance,
      this.swiper.slides.length
    );
    if (this.swiper.realIndex + this.distance >= this.swiper.slides.length) {
      this.onReachEnd();
    }
  }

  onReachEnd() {
    this.$emit("pull-left");
  }
}
</script>
<style lang="scss" scoped>
.ai-slider {
  height: 100%;
  border-radius: 8px;

  &__header {
    font-size: 16px;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: rgba(74, 74, 74, 1);
    line-height: 3;
  }
  &__swiper-item {
    box-sizing: border-box;
  }

  & ::v-deep .swiper-slide {
    height: 1px;
  }
  & ::v-deep .swiper-slide-active {
    height: auto !important;
  }
}
</style>
