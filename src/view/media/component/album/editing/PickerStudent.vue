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

@Component({
  components: {
    PickerItems,
    LyPickerPerson,
  },
})
export default class Home extends Mixins(SyncMixin) {
  open = false;
  students: any = null;

  @Watch("students", { deep: true })
  onStudentsChanged() {
    this.$emit("selected", this.students);
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
    this.students = concat(this.students || [], students || []);
    this.students = uniqBy(this.students || [], "id");
    this.open = false;
  }
}
</script>
<style lang="scss" scoped></style>
