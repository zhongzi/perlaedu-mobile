<template>
  <div class="wrapper search-bar">
    <ai-search @input="onInput" placeholder="查询">
      <template v-slot:left>
        <span />
      </template>
      <template v-slot:right>
        <i class="iconfont icon-search" />
      </template>
    </ai-search>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

import AiSearch from "@/view/component/AiSearch.vue";

@Component({
  components: {
    AiSearch,
  },
})
export default class Home extends Vue {
  onInput(v) {
    this.$bus.$emit("map:search:changed", v);
  }
}
</script>
<style lang="scss" scoped>
.search-bar {
  position: fixed;
  top: 0px;
  left: 0px;
  right: 0px;
  z-index: 9999;

  width: 100%;
  height: 10vh;

  display: flex;
  align-items: center;
  justify-content: center;

  & ::v-deep .ai-search {
    background: #fff;
    width: 90%;
    border-radius: 4px;

    i {
      color: #000;
    }

    .ai-search__input {
      color: #000;
      line-height: 1.5;

      &::placeholder {
        color: #9b9b9b;
      }
    }
  }
}
</style>
