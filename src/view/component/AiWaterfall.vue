<template>
  <div :class="b()">
    <ai-infinite-scroll
      height="90vh"
      ref="scroll"
      :list="list"
      :listTotal="listTotal"
      :loading="loading"
      @pull-down="$emit('pull-down')"
      @pull-up="$emit('pull-up')"
    >
      <template v-slot:header>
        <slot name="header" />
      </template>
      <template v-slot:list>
        <vue-flex-waterfall
          :class="b('waterfall')"
          :col="col"
          :colSpacing="gap"
          :breakByContainer="false"
          @order-update="refreshScroll"
        >
          <div
            v-for="(item, index) in list"
            :class="b('item')"
            :key="item.id"
            @click="onImageClicked(item, index)"
          >
            <slot
              name="item"
              :item="item"
              :index="index"
              :image="item.cover | alioss(originOption)"
            >
              <img :src="item.cover | alioss(originOption)" />
            </slot>
          </div>
        </vue-flex-waterfall>
      </template>
      <template v-slot:footer>
        <slot name="footer" />
      </template>
    </ai-infinite-scroll>
    <hui-dialog v-model="showDialog" :appendToBody="true" :class="b('dialog')">
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
                  :src="item[imgKey] | alioss(originOption)"
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

import AiInfiniteScroll from "./AiInfiniteScroll.vue";
import AiSlider from "./AiSlider.vue";

import map from "lodash/map";
import isEmpty from "lodash/isEmpty";
import cloneDeep from "lodash/cloneDeep";
import differenceBy from "lodash/differenceBy";
import intersectionBy from "lodash/intersectionBy";
import concat from "lodash/concat";
import forEach from "lodash/forEach";
import merge from "lodash/merge";
import find from "lodash/find";

import VueFlexWaterfall from "vue-flex-waterfall";

@Component({
  name: "ai-waterfall",
  components: {
    AiSlider,
    AiInfiniteScroll,
    VueFlexWaterfall,
  },
})
export default class Home extends Vue {
  @Prop({ type: Array, default: [] }) list: any;
  @Prop({ type: Number, default: 0 }) listTotal: number;
  @Prop({ type: String, default: "cover" }) imgKey: string;
  @Prop({ type: Number, default: 2 }) col: number;
  @Prop({ type: Number, default: 0 }) gap: number;
  @Prop({ type: Object, default: null }) option: any;
  @Prop({ type: Boolean, default: false }) loading: boolean;

  showDialog: boolean = false;
  curSlideNum: number = 0;
  innerPreviewList: any = [];

  get originOption() {
    return cloneDeep(merge({ width: 300 }, this.option || {}));
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

  @Watch("list")
  onListChanged() {
    this.refreshScroll();
  }

  refreshScroll() {
    this.$nextTick(() => {
      (this.$refs.scroll as any).refresh();
    });
  }

  onImageClicked(img, index) {
    this.curSlideNum = index;
    this.showDialog = true;
  }
}
</script>
<style lang="scss" scoped>
.ai-waterfall {
  padding: 0px 10px;
  height: 100%;

  &__item {
    width: calc(50% - 5px);
    margin-top: 5px;
  }

  &__waterfall {
    width: 100%;
  }
}
.ai-waterfall__dialog {
  & ::v-deep .h-dialog__dialog {
    max-height: 90%;
    overflow-y: scroll;
    background: inherit;
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
