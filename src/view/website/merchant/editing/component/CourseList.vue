<template>
  <ai-section class="wrapper editing-courses" title="热门课程">
    <course-add-entry @refresh="refresh = true" :merchant="merchant" />
    <ai-list-stored
      class="list"
      resource="course"
      :query="innerQuery"
      :refresh.sync="refresh"
      scrollType="slider"
      :enableEmpty="false"
      :sliderOptions="{ slidesPerView: 4 }"
    >
      <template v-slot:item="{ item, tag }">
        <course :course="item">
          <template v-slot="{ courseIcon }">
            <ai-button-float-delete @delete="onDelete(item, tag)" class="item">
              <i :class="['iconfont', 'icon-' + courseIcon]" />
            </ai-button-float-delete>
          </template>
        </course>
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

import merge from "lodash/merge";

@Component({
  components: {
    AiListStored,
    AiSection,
    AiButtonFloatDelete,
    Course,
    CourseAddEntry,
  },
})
export default class Home extends Mixins(SyncMixin) {
  @Prop({ type: Object, default: null }) merchant: any;
  @Prop({ type: Object, default: null }) query: any;

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
}
</style>
