<template>
  <div class="wrapper search-bar">
    <div class="location" v-if="city">
      <i class="iconfont icon-location" />
      <span> {{ city }}</span>
    </div>
    <ai-search @input="debKeywordChanged" placeholder="查询机构" class="search">
      <template v-slot:left>
        <span />
      </template>
      <template v-slot:right>
        <i class="iconfont icon-search" />
      </template>
    </ai-search>
    <div class="mode" v-if="isAdmin">
      <zone-add-entry />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";

import AiSearch from "@/view/component/AiSearch.vue";

import ZoneAddEntry from "./ZoneAddEntry.vue";

import _get from "lodash/get";
import debounce from "lodash/debounce";

@Component({
  components: {
    AiSearch,
    ZoneAddEntry,
  },
})
export default class Home extends Vue {
  city: any = null;
  debKeywordChanged: any = null;
  get isAdmin() {
    return _get(this.$auth, "user.kind") === 1;
  }

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
    background: #f2f2f2;
    padding: 5px;
    height: 35px;
    border-radius: 5px;

    i {
      font-size: 16px;
      color: #e61e15;
    }
    span {
      font-size: 10px;
      font-weight: 900;
      color: #9b9b9b;
    }
  }

  & ::v-deep .ai-search {
    background: #f2f2f2;
    height: 35px;
    border-radius: 5px;
    margin: 0px 10px;

    i {
      color: #e61e15;
      font-size: 16px;
    }

    .ai-search__input {
      color: #000;
      line-height: 1;

      &::placeholder {
        font-size: 14px;
        color: #9b9b9b;
      }
    }
  }
}
</style>
