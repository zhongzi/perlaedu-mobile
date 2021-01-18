<template>
  <div ref="wrapper" :style="{ height: height }" :class="b()">
    <div :class="b('content')">
      <div :style="mergedStyle">
        <slot :list="list" name="header" />
        <div :class="b('list')">
          <slot :list="list" name="list">
            <slot name="item-before" />
            <template v-for="(item, index) in list">
              <slot name="item" :list="list" :item="item" :index="index" />
            </template>
            <slot name="item-after" />
          </slot>
        </div>
        <div v-show="isEmpty && emptyText" :class="b('empty')">
          <slot :list="list" name="empty">
            {{ emptyText }}
          </slot>
        </div>
        <slot :list="list" name="footer" />
      </div>
      <slot v-if="enablePullUp" :isPullingUp="isPullingUp" name="pullup">
        <div v-if="enablePullUp" :class="b('pullup')">
          <div v-if="!isPullingUp">
            <span v-if="!isLoading">{{ pullingUpText }}</span>
          </div>
          <div v-else :class="b('loading')">
            <ai-double-bounce :class="b('animation')" />
            <label>{{ loadingTip }}</label>
          </div>
        </div>
      </slot>
    </div>
    <slot
      v-if="enablePullDown"
      :beforePullDown="beforePullDown"
      :isLoading="isLoading"
      name="pulldown"
    >
      <div :style="pullDownStyle" :class="b('pulldown')">
        <div v-if="beforePullDown">
          {{ pullDownTip }}
        </div>
        <div v-else :class="b('after-trigger')">
          <div v-if="isLoading" :class="b('loading')">
            <ai-double-bounce :class="b('loading-animation')" />
            <label :class="b('loading-label')">{{ loadingTip }}</label>
          </div>
          <div v-else>{{ pullDownFinishedTip }}</div>
        </div>
      </div>
    </slot>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";

import AiDoubleBounce from "./AiDoubleBounce.vue";

import BScroll from "better-scroll";

@Component({
  name: "ai-infinite-scroll",
  components: {
    AiDoubleBounce,
  },
})
export default class Home extends Vue {
  @Prop({ type: Boolean, default: false }) loading: boolean;
  @Prop({ type: Array, default: () => [] }) list: any;
  @Prop({ type: Number, default: 0 }) listTotal: number;
  @Prop({ type: String, default: "100vh" }) height: string;
  @Prop({ type: String, default: null }) emptyText: string;
  @Prop({ type: Number, default: 10 }) limit: number;
  @Prop({ type: Boolean, default: true }) autoLoad: boolean;
  @Prop({ type: Boolean, default: true }) enablePullUp: boolean;
  @Prop({ type: Boolean, default: true }) enablePullDown: boolean;
  @Prop({ type: Number, default: 50 }) pullDownHeight: number;
  @Prop({ type: Number, default: 50 }) pullDownThreshold: number;
  @Prop({ type: String, default: "下拉刷新" }) beforePullDownTip: string;
  @Prop({ type: String, default: "释放更新" }) willPullDownTip: string;
  @Prop({ type: String, default: "已加载" }) pullDownFinishedTip: string;
  @Prop({ type: String, default: "上拉加载" }) pullUpTip: string;
  @Prop({ type: String, default: "已全部加载" }) noMoreDataTip: string;
  @Prop({ type: String, default: "正在加载..." }) loadingTip: string;
  @Prop({ type: Object, default: () => ({}) }) contentStyle: any;

  scroll: any = null;
  scrollPos: number = 0;
  beforePullDown: boolean = true;
  isPullingDown: boolean = false;
  isRebounding: boolean = false;
  isPullingUp: boolean = false;
  isLoading: boolean = false;
  needInitData: boolean = false;

  get isEmpty() {
    return this.list.length <= 0;
  }

  get noMoreData() {
    return this.list.length >= this.listTotal;
  }

  get mergedStyle() {
    return Object.assign({ minHeight: this.height }, this.contentStyle || {});
  }

  get pullingUpText() {
    return this.noMoreData ? this.noMoreDataTip : this.pullUpTip;
  }

  get pullDownTip() {
    if (this.scrollPos > this.pullDownThreshold) {
      return this.willPullDownTip;
    }
    return this.beforePullDownTip;
  }

  get pullDownStyle() {
    if (this.beforePullDown) {
      return `top: ${Math.min(
        this.scrollPos - this.pullDownHeight - 10,
        this.pullDownHeight * 0.5
      )}px`;
    }
    if (this.isRebounding) {
      return `top: ${this.scrollPos - this.pullDownHeight + 10}px`;
    }
    return "top: 10px";
  }

  @Watch("loading")
  onLoadingChanged() {
    if (!this.loading) {
      this._loadFinished();
    }
  }

  activated() {
    let pos = this.scrollPos;
    if (pos !== 0) {
      this.scroll.scrollTo(0, pos, 0);
      this.scroll.refresh();
    }
  }

  mounted() {
    if (this.scroll) {
      return;
    }
    this.$nextTick(() => {
      this._initScroll();
    });
  }

  jScrollReset() {
    const stop = 40;
    this.scrollPos = stop;
    if (!this.scroll) {
      this.needInitData = true;
      return;
    }
    this.scroll.pulling = true;
    this.scroll.trigger("pullingDown");
    this.scroll.scrollTo(this.scroll.x, stop, this.scroll.options.bounceTime);
  }

  refresh() {
    this.$nextTick(() => {
      if (this.scroll) {
        this.scroll.refresh();
      }
    });
  }

  _initScroll() {
    let options = {
      scrollX: false,
      scrollY: true,
      pullUpLoad: this.enablePullUp,
      click: true,
      stopPropagation: true,
      nestedScroll: true,
      bindToWrapper: true,
    };
    if (this.enablePullDown) {
      options["pullDownRefresh"] = {
        threshold: this.pullDownThreshold,
        stop: this.pullDownHeight,
      };
    }
    this.scroll = new BScroll(this.$refs.wrapper as any, options as any);
    if (this.enablePullDown) {
      this._initPullDown();
    }
    if (this.enablePullUp) {
      this._initPullUp();
    }

    if (this.autoLoad || this.needInitData) {
      this.jScrollReset();
    }
  }

  _load(reset = false) {
    this.$emit(reset ? "pull-down" : "pull-up");
  }

  _loadFinished() {
    this.isLoading = false;
    if (this.isPullingDown) {
      this._reboundPullDown().then(() => {
        this._afterPullDown();
      });
      return;
    }

    if (this.isPullingUp) {
      this._finishPullUp();
    }
    this.refresh();
  }

  _initPullDown() {
    this.scroll.on("pullingDown", () => {
      this.beforePullDown = false;
      this.isPullingDown = true;
      this.isLoading = true;
      this._load(true);
    });

    this.scroll.on("scroll", (pos) => {
      this.scrollPos = pos.y;
    });
  }

  _reboundPullDown() {
    const stopTime = this.enablePullDown && 600;
    return new Promise((resolve) => {
      setTimeout(() => {
        this.isRebounding = true;
        this._finishPullDown();
        resolve();
      }, stopTime);
    });
  }

  _finishPullDown() {
    this.scroll.finishPullDown();
    this.isPullingDown = false;
  }

  _afterPullDown() {
    setTimeout(() => {
      this.beforePullDown = true;
      this.isRebounding = false;
      this.scroll.refresh();
    }, this.scroll.options.bounceTime);
  }

  _initPullUp() {
    this.scroll.on("pullingUp", () => {
      if (this.noMoreData) {
        this._finishPullUp();
        return;
      }

      this.isPullingUp = true;
      this._load();
    });
  }

  _finishPullUp() {
    this.scroll.finishPullUp();
    this.isPullingUp = false;
  }
}
</script>

<style lang="scss" scoped>
.ai-infinite-scroll {
  position: relative;
  width: 100%;

  &__list {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
  }

  &__empty {
    padding: 60px 0;
    text-align: center;
    font-size: 16px;
    width: 100%;
  }

  &__pullup {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 16px 0;
    font-size: 14px;
    color: gray;
  }

  &__pulldown {
    position: absolute;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: all;
    font-size: 14px;
    color: gray;
  }

  &__after-trigger {
    margin-top: 10px;
  }

  &__loading {
    &-animation {
      display: inline-block;
      width: 20px;
      height: 20px;
      vertical-align: middle;
    }

    &-label {
      display: inline-block;
      height: 20px;
      line-height: 20px;
      vertical-align: middle;
    }
  }
}
</style>
