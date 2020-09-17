<template>
  <div class="wrapper course">
    <ai-list-stored
      resource="course"
      :query="innerQuery"
      scrollType="none"
      :hideIfNoData="true"
    >
      <template v-slot:header>
        <div class="title">热门课程</div>
      </template>
      <template v-slot:item="{ item }">
        <course
          :course="item"
          :key="item.id"
          class="item"
          routeName="websiteUnionCourse"
        />
      </template>
    </ai-list-stored>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

import SyncMixin from "@/mixin/SyncMixin";

import AiListStored from "@/view/component/AiListStored.vue";
import Course from "./Course.vue";

import merge from "lodash/merge";

@Component({
  components: {
    AiListStored,
    Course,
  },
})
export default class Home extends Vue {
  @Prop({ type: Object, default: null }) union: any;
  @Prop({ type: Object, default: null }) query: any;

  get innerQuery() {
    return merge(
      {
        is_hot: true,
        "UnionMerchant.union_id": this.union.id,
        extras: "subject",
      },
      this.query || {}
    );
  }
}
</script>
<style lang="scss" scoped>
.course {
  margin-bottom: 10px;

  & ::v-deep .ai-list-stored__title {
    padding: 0px 27px;
  }

  & ::v-deep .ai-list-stored__list {
    margin: 0px 27px;
    justify-content: space-between;
    flex-wrap: wrap;
  }
  .title {
    font-size: 16px;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: #ffffff;
    line-height: 22px;
  }

  .item {
    display: inline-block;
    width: 20%;

    & ::v-deep i {
      min-height: 40px;
      color: #fff;
      margin-top: 10px;
    }
    & ::v-deep span {
      color: #fff;
      font-size: 18px;
    }
  }
}
</style>
