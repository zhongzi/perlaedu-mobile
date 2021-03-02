<template>
  <div class="wrapper course-list">
    <ai-list-stored
      resource="tag"
      scrollType="slider"
      :query="innerQuery"
      :sliderOptions="{
        slidesPerView: 1.8,
        initialSlide: 0,
        freeMode: true,
        spaceBetween: 20,
      }"
    >
      <template v-slot:header>
        <div class="title">我的课时</div>
      </template>
      <template v-slot:item="{ item }">
        <course-cell :course="item" :key="item.id" class="course" />
      </template>
      <template v-slot:empty>
        <div class="empty">没有关联到课时信息</div>
      </template>
    </ai-list-stored>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

import AiListStored from "@/view/component/AiListStored.vue";
import CourseCell from "./CourseCell.vue";

import merge from "lodash/merge";

@Component({
  components: {
    AiListStored,
    CourseCell,
  },
})
export default class Home extends Vue {
  @Prop({ type: Object, default: null }) query: any;

  get innerQuery() {
    return merge(
      {
        filters: JSON.stringify({
          "person_id.Person.openid": ["=" + this.$auth.user.openid],
          "person_id.Person.openid_second": ["=" + this.$auth.user.openid],
        }),
        extras: JSON.stringify({
          Tag: ["person"],
          Person: ["merchant"],
          Merchant: ["logo_url", "website"],
        }),
      },
      this.query || {}
    );
  }
}
</script>
<style lang="scss" scoped>
.course-list {
  .title {
    margin-left: 25px;
    font-size: 16px;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: rgba(74, 74, 74, 1);
    line-height: 3;
  }
  .course {
    margin-left: 23px;
    margin-bottom: 15px;
  }

  .empty {
    margin-left: 25px;

    font-size: 14px;
    color: #928e8e;
  }
}
</style>
