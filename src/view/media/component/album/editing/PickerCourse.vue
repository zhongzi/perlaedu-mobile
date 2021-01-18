<template>
  <div class="wrapper picker-course">
    <picker-items
      title="课程相册"
      :items="courses"
      labelKey=""
      logoKey=""
      valueKey=""
      @icon:delete:clicked="onClickDelete"
      @icon:plus:clicked="onClickPlus"
    />
    <ly-picker-course :open.sync="open" @selected="addCourses" />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Mixins, Prop, Watch } from "vue-property-decorator";
import SyncMixin from "@/mixin/SyncMixin";

import PickerItems from "./PickerItems.vue";
import LyPickerCourse from "@/view/layout/component/PickerCourse.vue";

import map from "lodash/map";
import isEmpty from "lodash/isEmpty";
import isString from "lodash/isString";
import concat from "lodash/concat";
import filter from "lodash/filter";
import uniq from "lodash/uniq";

@Component({
  components: {
    PickerItems,
    LyPickerCourse,
  },
})
export default class Home extends Mixins(SyncMixin) {
  open = false;
  courses: any = null;

  @Watch("courses", { deep: true })
  onCoursesChanged() {
    this.$emit("selected", this.courses);
  }

  onClickDelete(course) {
    this.courses = filter(this.courses || [], (item) => {
      return item !== course;
    });
  }

  onClickPlus() {
    this.open = true;
  }

  addCourses(courses) {
    this.courses = concat(this.courses || [], courses || []);
    this.courses = uniq(this.courses);
    this.open = false;
  }
}
</script>
<style lang="scss" scoped></style>
