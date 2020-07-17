<template>
  <div :class="b()">
    <template v-if="!(hideIfNoData && list.length <= 0)">
      <ai-infinite-scroll
        v-if="scrollType === 'scroll'"
        :height="scrollHeight"
        :loading="listLoading"
        :list="list"
        :listTotal="listTotal"
        @pull-down="loadData(true)"
        @pull-up="loadData"
      >
        <template v-slot:header>
          <div :class="b('title')">
            <slot name="header">
              {{ title }}
            </slot>
          </div>
        </template>
        <template v-slot:item="{ item, index }">
          <slot name="item" :item="item" :index="index" :tag="tag" />
        </template>
        <template v-slot:empty v-if="enableEmpty">
          <slot name="empty">
            <span>暂无数据</span>
          </slot>
        </template>
        <template v-slot:footer>
          <slot name="footer" />
        </template>
        <template v-slot:gotoTop>
          <slot name="gotoTop" />
        </template>
      </ai-infinite-scroll>
      <ai-slider
        v-else-if="scrollType === 'slider'"
        :list="list"
        :options="sliderOptions"
        :enableSlideBefore="enableSlideBefore"
        :enableSlideAfter="enableSlideAfter"
        @pull-left="loadData"
      >
        <template v-slot:header>
          <div :class="b('title')">
            <slot name="header">
              {{ title }}
            </slot>
          </div>
        </template>
        <template v-slot:slide-before>
          <slot name="slide-before" />
        </template>
        <template v-slot:item="{ item, index }">
          <slot name="item" :item="item" :index="index" :tag="tag" />
        </template>
        <template v-slot:footer>
          <slot name="footer"> </slot>
        </template>
      </ai-slider>
      <ai-waterfall
        v-else-if="scrollType === 'waterfall'"
        :list="list"
        :gap="gap"
        :loading="listLoading"
        :loadedAll="!hasMoreData"
        @load="loadData"
      >
        <template v-slot:header>
          <div :class="b('title')">
            <slot name="header">
              {{ title }}
            </slot>
          </div>
        </template>
        <template v-slot:item="{ item, index, image }">
          <slot
            name="item"
            :item="item"
            :index="index"
            :tag="tag"
            :image="image"
          >
            <img :src="image" />
          </slot>
        </template>
        <template v-slot:waterfall-over>
          <slot name="footer">
            <span> 全部加载完毕</span>
          </slot>
        </template>
      </ai-waterfall>
      <div v-else>
        <div :class="b('title')">
          <slot name="header">
            {{ title }}
          </slot>
        </div>
        <div :class="b('list')">
          <template v-for="(item, index) in list">
            <slot name="item" :item="item" :index="index" :tag="tag" />
          </template>
        </div>
        <div :class="b('footer')">
          <slot name="footer" :list="list" />
        </div>
        <hui-button
          :class="b('list-load-more')"
          type="error"
          @click.native="loadData"
          v-if="hasMoreData && enableMoreData"
        >
          加载更多
        </hui-button>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch, Mixins } from "vue-property-decorator";

import SyncMixin from "@/mixin/SyncMixin";
import AiInfiniteScroll from "./AiInfiniteScroll.vue";
import AiSlider from "./AiSlider.vue";
import AiWaterfall from "./AiWaterfall.vue";
import merge from "lodash/merge";

@Component({
  name: "ai-list-stored",
  components: {
    AiInfiniteScroll,
    AiSlider,
    AiWaterfall,
  },
})
export default class Home extends Mixins(SyncMixin) {
  @Prop({ type: String }) resource: string;
  @Prop({ type: String, default: null }) title: string;
  @Prop({ type: String, default: null }) outerTag: string;
  @Prop({ type: Object, default: () => ({}) }) query: object;
  @Prop({ type: Number, default: 10 }) limit: number;
  @Prop({ type: Boolean, default: false }) refresh: boolean;
  @Prop({ type: String, default: "scroll" }) scrollType: boolean;
  @Prop({ type: String, default: "90vh" }) scrollHeight: string;
  @Prop({ type: Boolean, default: true }) autoPullDown: boolean;
  @Prop({ type: Boolean, default: true }) enablePullDown: boolean;
  @Prop({ type: Boolean, default: true }) enablePullUp: boolean;
  @Prop({ type: Boolean, default: false }) enableGotoTop: boolean;
  @Prop({ type: Boolean, default: true }) enableEmpty: boolean;
  @Prop({ type: Boolean, default: false }) hideIfNoData: boolean;
  @Prop({ type: Boolean, default: false }) enableMoreData: boolean;
  @Prop({ type: Object, default: () => ({}) }) sliderOptions: object;
  @Prop({ type: Boolean, default: false }) enableSlideBefore: boolean;
  @Prop({ type: Boolean, default: true }) enableSlideAfter: boolean;
  @Prop({ type: Number, default: 8 }) gap: number;

  hasMoreData: boolean = true;

  created() {
    this.loadData(true);
  }

  @Watch("resource")
  onResourceChanged() {
    return this.loadData(true);
  }

  @Watch("query", { deep: true })
  onQueryChanged() {
    return this.loadData(true);
  }

  @Watch("refresh")
  onRefreshChanged() {
    return this.refresh && this.loadData(true);
  }

  @Watch("list")
  onListChanged() {
    this.$nextTick(() => {
      this.outerTag
        ? this.$bus.$emit(`${this.store}:${this.tag}`, {
            list: this.list,
            tag: this.tag,
            total: this.listTotal,
          })
        : this.$bus.$emit(`${this.store}`, {
            list: this.list,
            tag: this.tag,
            total: this.listTotal,
          });
      this.$emit("emit-list", {
        list: this.list,
        tag: this.tag,
        total: this.listTotal,
      });
    });
  }

  loadData(reset = false, limit = null, callback = null) {
    this.store = this.resource;

    const query = merge(
      { limit: limit || this.limit, include_count: true },
      this.query
    );
    this.tag = this.outerTag || this.encodeTag(query);

    this.$emit("update:refresh", false);
    this.loadList({
      reset: reset,
      query: query,
      success: (resp) => {
        this.hasMoreData = resp.data.data.length >= this.limit;
        this.$nextTick(() => {
          callback && callback(resp);
        });
      },
    });
  }
}
</script>
<style lang="scss" scoped>
.ai-list-stored {
  height: 100%;
  overflow: hidden;

  &__title {
    width: 100%;

    font-size: 16px;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: rgba(74, 74, 74, 1);
    line-height: 2.5;
  }
}
</style>
