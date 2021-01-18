<template>
  <div class="wrapper picker-student">
    <picker-items
      title="学生相册"
      :items="students"
      labelKey="realname"
      logoKey="avatar_url"
      @icon:delete:clicked="onClickDelete"
      @icon:plus:clicked="onClickPlus"
    />
    <ly-picker-person
      :open.sync="open"
      :query="{ only_student: true }"
      @selected="addStudents"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Mixins, Prop, Watch } from "vue-property-decorator";
import SyncMixin from "@/mixin/SyncMixin";

import PickerItems from "./PickerItems.vue";
import LyPickerPerson from "@/view/layout/component/PickerPerson.vue";

import map from "lodash/map";
import isEmpty from "lodash/isEmpty";
import isString from "lodash/isString";
import concat from "lodash/concat";
import filter from "lodash/filter";
import uniqBy from "lodash/uniqBy";
import differenceBy from "lodash/differenceBy";

@Component({
  components: {
    PickerItems,
    LyPickerPerson,
  },
})
export default class Home extends Mixins(SyncMixin) {
  @Prop({ type: Array, default: null }) studentsExisted: any;

  open = false;
  students: any = null;

  created() {
    this.initAlbums();
    this.addStudents(this.studentsExisted);
    this.$bus.$on("picker:clear", () => {
      this.students = [];
    });
  }

  @Watch("students", { deep: true })
  onStudentsChanged() {
    this.$emit(
      "selected",
      differenceBy(this.students, this.studentsExisted || [], "id"),
      differenceBy(this.studentsExisted || [], this.students, "id")
    );
  }

  @Watch("studentsExisted", { deep: true })
  onStudentsExistedChanged() {
    this.addStudents(this.studentsExisted);
  }

  initAlbums() {
    try {
      const albumsStr = this.$route.query.albums as string;
      if (isEmpty(albumsStr)) return;
      const albums = JSON.parse(albumsStr);
      albums.forEach((album) => {
        if (album.type === "student") {
          this.students = concat(this.students || [], {
            id: parseInt(album.id),
            realname: album.name,
          });
        }
      });
    } catch (e) {
      console.log(e);
    }
  }

  onClickDelete(student) {
    this.students = filter(this.students || [], (item) => {
      return item.id !== student.id;
    });
  }

  onClickPlus() {
    this.open = true;
  }

  addStudents(students) {
    if (isEmpty(students)) return;

    this.students = concat(this.students || [], students || []);
    this.students = uniqBy(this.students || [], "id");
    this.open = false;
  }
}
</script>
<style lang="scss" scoped></style>
