<template>
  <div class="layout-ui">
    <div class="search">
      <div class="ico">
        <span class="iconfont iconsousuo"></span>
      </div>
      <input class="search-input" type="text" v-model="keyword" />
      <div class="trigger">搜索</div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from "vue-property-decorator";

import debounce from "lodash/debounce";

@Component
export default class Home extends Vue {
  @Prop({ type: String, default: "" }) value: string;

  keyword: string = null;
  debEmit: any = null;

  created() {
    this.debEmit = debounce(this.emitInput, 800);
  }

  @Watch("keyword")
  onKeywordChanged() {
    this.debEmit();
  }

  emitInput() {
    this.$emit("input", this.keyword);
  }
}
</script>
<style lang="scss" scoped>
.wrapper {
  width: 100%;
  height: 100%;
}
</style>
