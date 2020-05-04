<template>
  <div :class="b()">
    <div :class="b('header')">
      <slot name="header" />
    </div>
    <div :class="b('content')" :style="{ height: height + 'px' }">
      <vue-better-scroll
        :class="b('content-scroll')"
        ref="scroll"
        :scrollbar="options.scrollbar"
        :pullDownRefresh="options.pullDownRefresh"
        :pullUpLoad="options.pullUpLoad"
        :startY="options.startY"
        @pulling-down="onPullingDown"
        @pulling-up="onPullingUp"
      >
        <div :class="b('content-scroll-list')" v-if="list.length > 0">
          <slot name="list" :list="list">
            <template v-for="(item, index) in list">
              <slot name="item" :item="item" :index="index" />
            </template>
          </slot>
        </div>
        <div :class="b('content-scroll-emtpy')" v-else-if="enableEmpty">
          <slot name="empty">
            暂无数据
          </slot>
        </div>
      </vue-better-scroll>
    </div>
    <div :class="b('footer')">
      <slot name="footer" />
    </div>
    <div :class="b('goto-top')" v-if="enableGotoTop" @click="scrollTop">
      <slot name="gotoTop">
        返回顶部
      </slot>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";

import VueBetterScroll from "vue2-better-scroll";
import merge from "lodash/merge";

@Component({
  name: "ai-infinite-scroll",
  components: {
    VueBetterScroll,
  },
})
export default class Home extends Vue {
  @Prop({ type: Array, default: () => [] }) list: any;
  @Prop({ type: Number, default: 500 }) height: number;
  @Prop({ type: Object, default: () => ({}) }) scrollOptions: any;
  @Prop({ type: Boolean, default: true }) autoPullDown: boolean;
  @Prop({ type: Boolean, default: true }) enablePullUp: boolean;
  @Prop({ type: Boolean, default: true }) enablePullDown: boolean;
  @Prop({ type: Boolean, default: false }) enableGotoTop: boolean;
  @Prop({ type: Boolean, default: true }) enableEmpty: boolean;

  get options() {
    return merge(
      {
        scrollX: 0,
        scrollY: 0,
        scrollToX: 0,
        scrollToY: 0,
        scrollToTime: 0,
        scrollbar: {
          fade: true,
        },
        pullUpLoad: this.enablePullUp && {
          threshold: 0,
          txt: {
            more: "加载更多",
            noMore: "没有更多数据了",
          },
        },
        pullDownRefresh: this.enablePullDown && {
          threshold: 90,
          stop: 40,
        },
      },
      this.scrollOptions
    );
  }

  get scroll() {
    return this.$refs.scroll;
  }

  @Watch("list", { deep: true })
  onListChanged() {
    this.$nextTick(() => {
      (this.scroll as any).forceUpdate(true);
    });
  }

  mounted() {
    this.autoPullDown && this.onPullingDown();
  }

  scrollTop() {
    (this.scroll as any).scrollTo(
      this.options.scrollToX,
      this.options.scrollToY,
      this.options.scrollToTime
    );
  }

  onPullingDown() {
    this.$emit("pull-down");
  }

  onPullingUp() {
    this.$emit("pull-up");
  }
}
</script>
<style lang="scss" scoped>
.ai-infinite-scroll {
  &__content {
    position: relative;

    &-scroll {
      position: absolute;
      top: 0px;
      bottom: 0px;
      left: 0px;
      right: 0px;
      overflow: scroll;
    }

    &-scroll-emtpy {
      padding: 20px;
      text-align: center;
    }
  }

  &__goto-top {
    position: fixed;
    right: 20px;
    bottom: 20px;
    background-color: #009a61;
    border-radius: 5px;
    border: 1px solid #fff;
    color: #fff;
    padding: 10px 15px;
  }
}
</style>
