<!--
  暂时只支持图片瀑布流管理, 计算元素高度自动将采用元素内涵图片高度进行计算, 所以不需要指定元素高度
  TODO: 修改了依赖组件的部分代码，时间问题暂时没有重写与通用化
-->
<template>
  <div :class="b()">
    <vue-waterfall-easy
      ref="waterfall"
      :class="b('list')"
      :imgsArr="innerPreviewList"
      :srcKey="imgKey"
      :mobileGap="gap"
      :gap="gap"
      @scrollReachBottom="$emit('load')"
    >
      <template v-slot:waterfall-head>
        <slot name="header" />
      </template>
      <template v-slot="{ index, value }">
        <div @click="onImageClicked(value, index)">
          <slot
            name="item"
            :item="value"
            :index="index"
            :image="value[imgKey]"
            v-if="value"
          >
            <img :src="value[imgKey]" />
          </slot>
        </div>
      </template>
      <template v-slot:waterfall-over>
        <slot name="footer"> </slot>
      </template>
    </vue-waterfall-easy>
    <div :class="b('footer')">
      <slot name="slot" />
    </div>
    <hui-dialog
      v-model="showDialog"
      :appendToBody="true"
      :class="b('dialog')"
      v-if="showDialog"
    >
      <div :class="b('dialog-content')">
        <ai-slider
          :list="list"
          :options="swiperOptions"
          :showFlipButton="true"
          :showPagination="true"
          :slideToNum.sync="curSlideNum"
        >
          <template v-slot:item="{ item, index }">
            <slot name="slider" :item="item" :index="index">
              <div :class="b('dialog-content-item')">
                <img
                  :src="item[imgKey]"
                  @click="showDialog = false"
                  v-if="index <= curSlideNum + 3"
                />
              </div>
            </slot>
          </template>
        </ai-slider>
      </div>
    </hui-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import vueWaterfallEasy from "vue-waterfall-easy/src/vue-waterfall-easy/vue-waterfall-easy.vue";

import AiSlider from "./AiSlider.vue";

import map from "lodash/map";
import isEmpty from "lodash/isEmpty";
import cloneDeep from "lodash/cloneDeep";
import differenceBy from "lodash/differenceBy";
import intersectionBy from "lodash/intersectionBy";
import concat from "lodash/concat";
import forEach from "lodash/forEach";

@Component({
  name: "ai-waterfall",
  components: {
    vueWaterfallEasy,
    AiSlider,
  },
})
export default class Home extends Vue {
  @Prop({ type: Array, default: [] }) list: any;
  @Prop({ type: String, default: "cover" }) imgKey: string;
  @Prop({ type: Boolean, default: false }) loading: boolean;
  @Prop({ type: Boolean, default: false }) loadedAll: boolean;
  @Prop({ type: Number, default: 8 }) gap: number;

  showDialog: boolean = false;
  curSlideNum: number = 0;
  innerPreviewList: any = [];

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

  created() {
    this.resetInnerList();
  }

  @Watch("list", { deep: true })
  onListChanged() {
    this.resetInnerList();
  }

  @Watch("loadedAll", { deep: true })
  onLoadedAllChanged() {
    console.log(this.loadedAll);
    if (!this.loadedAll) return;
    (this.$refs.waterfall as any).waterfallOver();
  }

  resetInnerList() {
    const inLi = intersectionBy(this.innerPreviewList, this.list, "id");
    const outLi = forEach(
      cloneDeep(differenceBy(this.list, this.innerPreviewList, "id")),
      (item) => {
        item[this.imgKey] = this.$options.filters.alioss
          ? this.$options.filters.alioss(item[this.imgKey], { width: 150 })
          : item[this.imgKey];
      }
    );
    this.innerPreviewList = concat(inLi, outLi);
  }

  onImageClicked(img, index) {
    this.curSlideNum = index;
    this.showDialog = true;
  }
}
</script>
<style lang="scss" scoped>
.ai-waterfall {
  height: 100%;

  &__list {
    height: 100%;

    & ::v-deep .img-inner-box {
      background: rgba(0, 0, 0, 0.1);
      box-shadow: none !important;
    }
  }
}
.ai-waterfall__dialog {
  & ::v-deep .h-dialog__dialog {
    max-height: 90%;
    overflow-y: scroll;
  }

  & ::v-deep .ai-slider__title {
    text-align: center;
  }
  img {
    width: 100%;
    vertical-align: bottom;
  }

  &-content-item {
    background: #fff;
    height: 100%;
    display: inline-block;
  }
}
</style>
