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
import differenceWith from "lodash/differenceWith";

@Component({
  components: {
    PickerItems,
    LyPickerCourse,
  },
})
export default class Home extends Mixins(SyncMixin) {
  @Prop({ type: Array, default: null }) coursesExisted: any;

  open = false;
  courses: any = null;

  created() {
    this.initAlbums();
    this.addExistedCourses();
    this.$bus.$on("picker:clear", () => {
      this.courses = [];
    });
  }

  @Watch("courses", { deep: true })
  onCoursesChanged() {
    this.$emit(
      "selected",
      differenceWith(
        this.courses,
        this.coursesExisted,
        (val, othVal) => val === othVal.title
      ),
      differenceWith(
        this.coursesExisted,
        this.courses,
        (othVal, val) => val === othVal.title
      )
    );
  }

  @Watch("coursesExisted", { deep: true })
  onCoursesExistedChanged() {
    this.addExistedCourses();
  }

  initAlbums() {
    try {
      const albumsStr = this.$route.query.albums as string;
      if (isEmpty(albumsStr)) return;
      const albums = JSON.parse(albumsStr);
      albums.forEach((album) => {
        if (album.type === "course") {
          this.courses = concat(this.courses || [], [album.name]);
        }
      });
    } catch (e) {
      console.log(e);
    }
  }

  addExistedCourses() {
    this.addCourses(map(this.coursesExisted || [], "title"));
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
