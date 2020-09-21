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
      @reachEnd="onReachEnd"
      @slideChange="onSlideChanged"
    >
      <swiper-slide :class="b('swiper-item')" v-if="enableSlideBefore">
        <slot name="slide-before" />
      </swiper-slide>
      <swiper-slide
        :class="b('swiper-item')"
        v-for="(item, index) in list"
        :key="item.id || index"
      >
        <slot name="item" :item="item" :index="index" />
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
import "swiper/css/swiper.css";
import { Swiper, SwiperSlide } from "vue-awesome-swiper";

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

  get swiperOptions() {
    return merge(
      {
        spaceBetween: 0,
        freeMode: true,
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
    (this.$refs.mySwiper as any).$swiper.slideTo(this.slideToNum, 1000, false);
  }

  onSlideChanged() {
    this.$emit("update:slideToNum", this.swiper.realIndex);
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
}
</style>
