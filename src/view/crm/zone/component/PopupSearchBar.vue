<template>
  <div class="wrapper search-bar">
    <div class="location" v-if="city">
      <i class="iconfont icon-location" />
      <span> {{ city }}</span>
    </div>
    <ai-search @input="debKeywordChanged" placeholder="查询当前城市机构">
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
import { Component, Vue, Watch } from "vue-property-decorator";

import AiSearch from "@/view/component/AiSearch.vue";

import debounce from "lodash/debounce";

@Component({
  components: {
    AiSearch,
  },
})
export default class Home extends Vue {
  city: any = null;
  debKeywordChanged: any = null;

  created() {
    this.$bus.$on("map:location:current:fetched", (location) => {
      this.city = location.city;
    });

    this.debKeywordChanged = debounce(this.onInput, 800);
  }
  @Watch("city")
  onCityChanged() {
    this.$bus.$emit("map:city:changed", this.city);
  }

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
  z-index: 1001;

  width: 100%;
  height: 10vh;

  display: flex;
  align-items: center;
  justify-content: center;

  .location {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: #fff;
    padding: 5px;

    i {
      font-size: 20px;
      color: #e61e15;
    }
    span {
      font-size: 12px;
      font-weight: 900;
      color: #9b9b9b;
    }
  }

  & ::v-deep .ai-search {
    background: #fff;
    width: 80%;
    border-radius: 4px;

    i {
      color: #e61e15;
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
