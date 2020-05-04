<template>
  <div :class="b()">
    <ai-infinite-scroll
      v-if="enableScroll"
      :list="list"
      :enableGotoTop="enableGotoTop"
      :height="height"
      :enableEmpty="enableEmpty"
      @pull-up="onPullUp"
      @pull-down="onPullDown"
    >
      <template v-slot:header>
        <slot name="header" />
      </template>
      <template v-slot:item="{ item, index }">
        <slot name="item" :item="item" :index="index" :tag="tag" />
      </template>
      <template v-slot:empty v-if="enableEmpty">
        <slot name="empty" />
      </template>
      <template v-slot:footer>
        <slot name="footer" />
      </template>
      <template v-slot:gotoTop>
        <slot name="gotoTop" />
      </template>
    </ai-infinite-scroll>
    <div :class="b('list')" v-else>
      <div :class="b('list-header')">
        <slot name="header" />
      </div>
      <template v-for="(item, index) in list">
        <slot name="item" :item="item" :index="index" :tag="tag" />
      </template>
      <div :class="b('list-empty')" v-if="enableEmpty">
        <slot name="empty">
          暂无数据
        </slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch, Mixins } from "vue-property-decorator";

import SyncMixin from "@/mixin/SyncMixin";
import AiInfiniteScroll from "./AiInfiniteScroll.vue";
import merge from "lodash/merge";

@Component({
  name: "ai-list-stored",
  components: {
    AiInfiniteScroll,
  },
})
export default class Home extends Mixins(SyncMixin) {
  @Prop({ type: String }) resource: string;
  @Prop({ type: String, default: null }) outerTag: string;
  @Prop({ type: Object, default: () => ({}) }) query: object;
  @Prop({ type: Number, default: 10 }) limit: number;
  @Prop({ type: Boolean, default: true }) refresh: boolean;
  @Prop({ type: Boolean, default: true }) enableScroll: boolean;
  @Prop({ type: Number, default: 400 }) height: number;
  @Prop({ type: Boolean, default: true }) autoPullDown: boolean;
  @Prop({ type: Boolean, default: true }) enablePullDown: boolean;
  @Prop({ type: Boolean, default: true }) enablePullUp: boolean;
  @Prop({ type: Boolean, default: false }) enableGotoTop: boolean;
  @Prop({ type: Boolean, default: true }) enableEmpty: boolean;
  @Prop({ type: Boolean, default: true }) loading: boolean;

  created() {
    this.enableLoading = this.loading;
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

  onPullDown() {
    this.loadData(true);
  }

  onPullUp() {
    this.loadData();
  }

  loadData(reset = false) {
    this.store = this.resource;

    const query = merge({ limit: this.limit, include_count: true }, this.query);
    this.tag = this.outerTag || this.encodeTag(query);

    this.$emit("update:refresh", false);
    this.loadList({
      reset: reset,
      query: query,
    });
  }
}
</script>
