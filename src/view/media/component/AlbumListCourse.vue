<template>
  <ai-list-stored
    resource="course"
    :scrollType="scrollType"
    :query="query"
    :sliderOptions="{ slidesPerView: 4.5, spaceBetween: 15 }"
  >
    <template v-slot:header v-if="isSliderMode">
      <div class="header">
        <div class="title">科目相册</div>
        <div class="more" @click="gotoSearch">
          <span>查看全部</span>
          <i class="iconfont icon-direction" />
        </div>
      </div>
    </template>
    <template v-slot:item="{ item }">
      <album-cell-course
        :course="item"
        :key="item"
        :merchantId="merchantId"
        :mode="scrollType"
      />
    </template>
  </ai-list-stored>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

import AiListStored from "@/view/component/AiListStored.vue";

import AlbumCellCourse from "./AlbumCellCourse.vue";

import isEmpty from "lodash/isEmpty";

@Component({
  components: {
    AiListStored,
    AlbumCellCourse,
  },
})
export default class Home extends Vue {
  @Prop({ type: [String, Number], default: null }) merchantId: string | number;
  @Prop({ type: String, default: "slider" }) scrollType: string;
  @Prop({ type: String, default: null }) keyword: string;

  get isSliderMode() {
    return this.scrollType === "slider";
  }

  get query() {
    const query: any = {
      require_course_in_teaching: true,
    };
    if (!isEmpty(this.keyword)) {
      query.keyword = this.keyword;
    }
    return query;
  }

  gotoSearch() {
    this.$router.push({
      name: "mediaAlbumsSearch",
      query: {
        type: "course",
      },
    });
  }
}
</script>
<style lang="scss" scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0px 10px;
}
</style>
