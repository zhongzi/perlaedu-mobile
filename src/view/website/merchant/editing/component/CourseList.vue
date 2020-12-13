<template>
  <ai-section class="wrapper editing-courses" :title="title || '热门课程'">
    <ai-list-stored
      class="list"
      resource="course"
      :query="innerQuery"
      :refresh.sync="refresh"
      scrollType="slider"
      :enableEmpty="false"
      :sliderOptions="{ slidesPerView: 5, spaceBetween: 20 }"
      :enableSlideBefore="true"
    >
      <template v-slot:slide-before>
        <course-add-entry
          @refresh="refresh = true"
          :merchant="merchant"
          class="entry"
        />
      </template>
      <template v-slot:item="{ item, tag, index }">
        <ai-button-float-delete @delete="onDelete(item, tag)" class="item">
          <course :course="item" routeName="websiteEditingCourse" />
        </ai-button-float-delete>
        <action-sequence-update
          v-if="index > 0"
          class="sequence"
          resource="course"
          :target="item"
          @refresh="refresh = true"
        />
      </template>
    </ai-list-stored>
  </ai-section>
</template>

<script lang="ts">
import { Component, Vue, Prop, Mixins } from "vue-property-decorator";

import SyncMixin from "@/mixin/SyncMixin";

import AiListStored from "@/view/component/AiListStored.vue";
import AiSection from "@/view/component/AiSection.vue";
import AiButtonFloatDelete from "@/view/component/AiButtonFloatDelete.vue";
import Course from "@/view/website/component/Course.vue";

import CourseAddEntry from "./CourseAddEntry.vue";
import ActionSequenceUpdate from "./ActionSequenceUpdate.vue";

import merge from "lodash/merge";

@Component({
  components: {
    AiListStored,
    AiSection,
    AiButtonFloatDelete,
    Course,
    CourseAddEntry,
    ActionSequenceUpdate,
  },
})
export default class Home extends Mixins(SyncMixin) {
  @Prop({ type: Object, default: null }) merchant: any;
  @Prop({ type: Object, default: null }) query: any;
  @Prop({ type: String, default: null }) title: string;

  refresh: boolean = false;

  get innerQuery() {
    return merge(
      {
        merchant_id: this.$route.params.merchantId,
        extras: "subject",
      },
      this.query || {}
    );
  }

  onDelete(course, tag) {
    this.store = "course";
    this.id = course.id;
    this.tag = tag;
    this.deleteEntity({
      res: { id: this.id },
      success: () => {
        this.$nextTick(() => {
          this.refresh = true;
        });
      },
    });
  }
}
</script>
<style lang="scss" scoped>
.editing-courses {
  & ::v-deep .ai-section__body {
    display: flex;
    align-items: center;
  }

  & ::v-deep .ai-section__header {
    margin-left: 20px;
  }

  .entry {
    margin-left: 20px;
  }

  .list {
    flex: 1;
    overflow-x: scroll;
  }

  .item {
    i {
      font-size: 32px;
      color: rgba(237, 139, 65, 1);
    }
  }
  .sequence {
    position: relative;
    top: -5px;
  }
}
</style>
