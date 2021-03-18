<template>
  <div class="wrapper notice-targets-picker">
    <div class="actions">
      <ai-button class="action" @click.native="addMerchant">
        <span> 全校 </span>
      </ai-button>
      <ai-button class="action" @click.native="openGroupPicker = true">
        <i class="iconfont icon-plus" />
        <span> 班级 </span>
      </ai-button>
      <ai-button class="action" @click.native="openCoursePicker = true">
        <i class="iconfont icon-plus" />
        <span> 科目 </span>
      </ai-button>
      <ai-button class="action" @click.native="openTeacherPicker = true">
        <i class="iconfont icon-plus" />
        <span> 老师 </span>
      </ai-button>
      <ai-button class="action" @click.native="openStudentPicker = true">
        <i class="iconfont icon-plus" />
        <span> 学生 </span>
      </ai-button>
    </div>
    <ly-picker-group :open.sync="openGroupPicker" @selected="addGroups" />
    <ly-picker-course :open.sync="openCoursePicker" @selected="addCourses" />
    <ly-picker-person
      :open.sync="openStudentPicker"
      :query="{ only_student: true }"
      @selected="addPersons"
    />
    <ly-picker-person
      :open.sync="openTeacherPicker"
      :query="{ only_teacher: true }"
      @selected="addPersons"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Mixins, Watch } from "vue-property-decorator";

import SyncMixin from "@/mixin/SyncMixin";

import AiButton from "@/view/component/AiButton.vue";

import LyPickerGroup from "@/view/layout/component/PickerGroup.vue";
import LyPickerCourse from "@/view/layout/component/PickerCourse.vue";
import LyPickerPerson from "@/view/layout/component/PickerPerson.vue";

import { PersonRole } from "@/enum/person_role";

import isEmpty from "lodash/isEmpty";
import filter from "lodash/filter";
import trim from "lodash/trim";
import map from "lodash/map";

@Component({
  components: {
    AiButton,
    LyPickerGroup,
    LyPickerCourse,
    LyPickerPerson,
  },
})
export default class Home extends Mixins(SyncMixin) {
  openGroupPicker = false;
  openCoursePicker = false;
  openTeacherPicker = false;
  openStudentPicker = false;

  created() {
    this.initTargets();
  }

  @Watch("$route", { deep: true })
  onRouteChanged() {
    this.initTargets();
  }

  initTargets() {
    this.initGroups();
    this.initCourses();
    this.initPersons();
  }

  initCourses() {
    const courses = filter(
      map(((this.$route.query.tag || "") + "").split(","), (id) => trim(id)),
      (x) => !isEmpty(x)
    );
    if (isEmpty(courses)) return;

    this.addCourses(courses);
  }

  initGroups() {
    const ids = filter(
      map(((this.$route.query.group || "") + "").split(","), (id) =>
        parseInt(id)
      ),
      (x) => x
    );
    if (isEmpty(ids)) return;

    this.loadList({
      store: "group",
      query: {
        id: ids,
      },
      success: (resp) => {
        this.addGroups(resp.data.data);
      },
    });
  }

  initPersons() {
    const ids = filter(
      map(((this.$route.query.person || "") + "").split(","), (id) =>
        parseInt(id)
      ),
      (x) => x
    );
    if (isEmpty(ids)) return;

    this.loadList({
      store: "person",
      query: {
        id: ids,
      },
      success: (resp) => {
        this.addPersons(resp.data.data);
      },
    });
  }

  addMerchant() {
    this.$emit("selected", [
      {
        target_id: this.$auth.user.curr_merch_id,
        target_class: "Merchant",
        role: PersonRole.student.value,
      },
    ]);
  }

  addGroups(groups) {
    this.$emit(
      "selected",
      map(groups || [], (group) => {
        return {
          target_id: group.id,
          target_class: "Group",
          target: group,
          role: PersonRole.student.value,
        };
      })
    );
    this.openGroupPicker = false;
  }

  addCourses(courses) {
    this.$emit(
      "selected",
      map(courses || [], (course) => {
        return {
          target_id: 0,
          target_class: course,
          role: PersonRole.student.value,
        };
      })
    );
    this.openCoursePicker = false;
  }

  addPersons(persons) {
    this.$emit(
      "selected",
      map(persons || [], (person) => {
        return {
          target_id: person.id,
          target_class: "Person",
          target: person,
          is_blocked: false,
          role: 0,
        };
      })
    );
    this.openTeacherPicker = false;
    this.openStudentPicker = false;
  }
}
</script>
<style lang="scss" scoped>
.notice-targets-picker {
  .actions {
    display: flex;
    align-items: center;
    justify-content: space-around;
    .action {
      height: auto;
      padding: 5px;
      margin: 5px;
      i {
        font-size: 12px;
      }
      span {
        font-size: 12px;
      }
    }
  }
}
</style>
