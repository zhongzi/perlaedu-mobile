<template>
  <ai-dialog
    v-if="mode === 'dialog'"
    class="wrapper add-links"
    :value="open"
    :hideOnBlur="false"
    @input="updateOpen"
  >
    <div class="dialog">
      <div class="title">{{ title }}</div>
      <picker-student
        class="section"
        :studentsExisted="studentsExisted"
        @selected="onSelectedStudents"
      />
      <picker-teacher
        class="section"
        :teachersExisted="teachersExisted"
        @selected="onSelectedTeachers"
      />
      <picker-group
        class="section"
        :groupsExisted="groupsExisted"
        @selected="onSelectedGroups"
      />
      <picker-course
        class="section"
        :coursesExisted="coursesExisted"
        @selected="onSelectedCourses"
      />
      <picker-album
        class="section"
        :albumsExisted="albumsExisted"
        @selected="onSelectedAlbums"
      />
      <ai-submit-actions @cancel="updateOpen(false)" @submit="save" />
    </div>
  </ai-dialog>
  <div v-else>
    <template v-if="type">
      <picker-student
        v-if="type === 'student'"
        class="section"
        :studentsExisted="studentsExisted"
        @selected="onSelectedStudents"
      />
      <picker-teacher
        v-if="type === 'teacher'"
        class="section"
        :teachersExisted="teachersExisted"
        @selected="onSelectedTeachers"
      />
      <picker-group
        v-if="type === 'group'"
        class="section"
        :groupsExisted="groupsExisted"
        @selected="onSelectedGroups"
      />
      <picker-course
        v-if="type === 'course'"
        class="section"
        :coursesExisted="coursesExisted"
        @selected="onSelectedCourses"
      />
      <picker-album
        v-if="type === 'album'"
        class="section"
        :albumsExisted="albumsExisted"
        @selected="onSelectedAlbums"
      />
    </template>
    <ai-button-round v-if="!showPickers" @click.native="showPickers = true">
      添加{{ type && "更多" }}关联</ai-button-round
    >
    <template v-if="showPickers">
      <picker-student
        v-if="!type || type !== 'student'"
        class="section"
        :studentsExisted="studentsExisted"
        @selected="onSelectedStudents"
      />
      <picker-teacher
        v-if="!type || type !== 'teacher'"
        class="section"
        :teachersExisted="teachersExisted"
        @selected="onSelectedTeachers"
      />
      <picker-group
        v-if="!type || type !== 'group'"
        class="section"
        :groupsExisted="groupsExisted"
        @selected="onSelectedGroups"
      />
      <picker-course
        v-if="!type || type !== 'course'"
        class="section"
        :coursesExisted="coursesExisted"
        @selected="onSelectedCourses"
      />
      <picker-album
        v-if="!type || type !== 'album'"
        class="section"
        :albumsExisted="albumsExisted"
        @selected="onSelectedAlbums"
      />
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Mixins, Watch } from "vue-property-decorator";

import SyncMixin from "@/mixin/SyncMixin";

import AiDialog from "@/view/component/AiDialog.vue";
import AiButtonRound from "@/view/component/AiButtonRound.vue";
import AiSubmitActions from "@/view/component/AiSubmitActions.vue";

import PickerStudent from "./PickerStudent.vue";
import PickerTeacher from "./PickerTeacher.vue";
import PickerGroup from "./PickerGroup.vue";
import PickerCourse from "./PickerCourse.vue";
import PickerAlbum from "./PickerAlbum.vue";

import { PersonRole } from "@/enum/person_role";

import isEmpty from "lodash/isEmpty";
import concat from "lodash/concat";
import map from "lodash/map";
import flatten from "lodash/flatten";
import filter from "lodash/filter";
import isArray from "lodash/isArray";
import groupBy from "lodash/groupBy";
import forEach from "lodash/forEach";
import uniqBy from "lodash/uniqBy";
import find from "lodash/find";
import differenceBy from "lodash/differenceBy";

@Component({
  components: {
    AiDialog,
    AiButtonRound,
    AiSubmitActions,
    PickerStudent,
    PickerTeacher,
    PickerGroup,
    PickerCourse,
    PickerAlbum,
  },
})
export default class Home extends Mixins(SyncMixin) {
  @Prop({ type: String, default: null }) title: boolean;
  @Prop({ type: Boolean, default: false }) open: boolean;
  @Prop({ type: [Array, Object], default: null }) medias: any;
  @Prop({ type: Array, default: null }) links: any;
  @Prop({ type: Boolean, default: false }) removeable: boolean;
  @Prop({ type: String, default: "dialog" }) mode: string;

  studentsExisted: any = null;
  students: any = null;
  studentsToDeleted: any = null;

  teachersExisted: any = null;
  teachers: any = null;
  teachersToDeleted: any = null;

  groupsExisted: any = null;
  groups: any = null;
  groupsToDeleted: any = null;

  coursesExisted: any = null;
  courses: any = null;
  coursesToDeleted: any = null;

  albumsExisted: any = null;
  albums: any = null;
  albumsToDeleted: any = null;

  showPickers = false;
  isLoadedExists = false;
  curTitle = null;
  get isActivated() {
    return this.curTitle === this.title;
  }

  get innerMedias() {
    return concat(
      map(this.links || [], (link) => link.media),
      this.medias || []
    );
  }

  get hasExisted() {
    return !(
      isEmpty(this.studentsExisted) &&
      isEmpty(this.teachersExisted) &&
      isEmpty(this.groupsExisted) &&
      isEmpty(this.coursesExisted) &&
      isEmpty(this.albumsExisted)
    );
  }

  get type() {
    return this.$route.query.type;
  }

  created() {
    this.$bus.$on("ai:popup", (v) => {
      this.isActivated && this.updateOpen(!v);
    });
    this.$bus.$on("add:links:title", (v) => {
      this.curTitle = v;
    });

    this.$bus.$on("media:saving", () => {
      this.save(true);
    });
    this.loadLinks();
  }

  @Watch("medias", { deep: true })
  onMediasChanged(newVal, oldVal) {
    if (this.isLoadedExists && oldVal && oldVal.length === 1) {
      this.isLoadedExists = false;
      this.reset(true);
      this.$bus.$emit("picker:clear");
    }

    const addMedias = differenceBy(newVal || [], oldVal || [], "id");
    const delMedias = differenceBy(oldVal || [], newVal || [], "id");
    this.handleLinksExistedOnMediasChanged(addMedias, delMedias);

    if (newVal && newVal.length === 1) {
      this.loadLinks();
    }
  }

  handleLinksExistedOnMediasChanged(addMedias = null, delMedias = null) {
    if (!this.hasExisted) {
      return;
    }
    if (!isEmpty(addMedias)) {
      this.saveLinksCore({
        students: this.studentsExisted,
        teachers: this.teachersExisted,
        groups: this.groupsExisted,
        courses: this.coursesExisted,
        albums: this.albumsExisted,
        medias: addMedias,
      });
    }
    if (!isEmpty(delMedias)) {
      this.saveLinksCore({
        studentsToDeleted: this.studentsExisted,
        teachersToDeleted: this.teachersExisted,
        groupsToDeleted: this.groupsExisted,
        coursesToDeleted: this.coursesExisted,
        albumsToDeleted: this.albumsExisted,
        medias: delMedias,
      });
    }
  }

  reset(withExisted = false, withSelected = false) {
    this.studentsToDeleted = null;
    this.teachersToDeleted = null;
    this.groupsToDeleted = null;
    this.coursesToDeleted = null;
    this.albumsToDeleted = null;

    if (withExisted) {
      this.studentsExisted = null;
      this.teachersExisted = null;
      this.groupsExisted = null;
      this.coursesExisted = null;
      this.albumsExisted = null;
    }

    if (withSelected) {
      this.students = null;
      this.teachers = null;
      this.groups = null;
      this.courses = null;
      this.albums = null;
    }
  }

  loadLinks() {
    if (
      isEmpty(this.medias) ||
      (isArray(this.medias) && this.medias.length !== 1)
    )
      return;

    this.loadList({
      store: "mediaLink",
      reset: true,
      query: {
        media_id: this.medias[0].id,
        limit: 100,
        extras: "target",
      },
      success: (resp) => {
        if (!isEmpty(resp.data.data)) {
          this.isLoadedExists = true;
        }
        this.resetLinksExisted(resp.data.data);
      },
    });
  }

  resetLinksExisted(links) {
    this.studentsExisted = differenceBy(
      this.studentsExisted || [],
      this.studentsToDeleted || [],
      "id"
    );
    this.teachersExisted = differenceBy(
      this.teachersExisted || [],
      this.teachersToDeleted || [],
      "id"
    );
    this.groupsExisted = differenceBy(
      this.groupsExisted || [],
      this.groupsToDeleted || [],
      "id"
    );
    this.coursesExisted = differenceBy(
      this.coursesExisted || [],
      this.coursesToDeleted || [],
      "id"
    );
    this.albumsExisted = differenceBy(
      this.albumsExisted || [],
      this.albumsToDeleted || [],
      "id"
    );

    links = filter(links, (link) => !link.is_deleted);
    if (isEmpty(links)) return;

    // 解析新增
    const newStudentsExisted = map(
      groupBy(
        filter(
          links,
          (item) =>
            item.target_class === "Person" &&
            (item.target.role & PersonRole.student.value) > 0
        ),
        "target.id"
      ),
      (group) => {
        const student = group[0].target;
        student.links = group;
        return student;
      }
    );
    // 合并
    forEach(newStudentsExisted, (newSt) => {
      let student = find(this.studentsExisted, { id: newSt.id });
      if (!student) {
        this.studentsExisted = concat(this.studentsExisted || [], newSt);
      } else {
        student.links = uniqBy(concat(student.links, newSt.links), "id");
      }
    });

    const newTeachersExisted = map(
      groupBy(
        filter(
          links,
          (item) =>
            item.target_class === "Person" &&
            (item.target.role & PersonRole.teacher.value) > 0
        ),
        "target.id"
      ),
      (group) => {
        const teacher = group[0].target;
        teacher.links = group;
        return teacher;
      }
    );
    forEach(newTeachersExisted, (newSt) => {
      let teacher = find(this.teachersExisted, { id: newSt.id });
      if (!teacher) {
        this.teachersExisted = concat(this.teachersExisted || [], newSt);
      } else {
        teacher.links = uniqBy(concat(teacher.links, newSt.links), "id");
      }
    });

    const newGroupsExisted = map(
      groupBy(
        filter(links, (item) => item.target_class === "Group"),
        "target.id"
      ),
      (group) => {
        const group_ = group[0].target;
        group_.links = group;
        return group_;
      }
    );
    forEach(newGroupsExisted, (newSt) => {
      let group = find(this.groupsExisted, { id: newSt.id });
      if (!group) {
        this.groupsExisted = concat(this.groupsExisted || [], newSt);
      } else {
        group.links = uniqBy(concat(group.links, newSt.links), "id");
      }
    });

    const newCoursesExisted = map(
      groupBy(
        filter(
          links,
          (item) =>
            item.target_class === "MediaAlbum" && item.target.type === "course"
        ),
        "target.id"
      ),
      (group) => {
        const course = group[0].target;
        course.links = group;
        return course;
      }
    );
    forEach(newCoursesExisted, (newSt) => {
      let course = find(this.coursesExisted, { id: newSt.id });
      if (!course) {
        this.coursesExisted = concat(this.coursesExisted || [], newSt);
      } else {
        course.links = uniqBy(concat(course.links, newSt.links), "id");
      }
    });

    const newAlbumsExisted = map(
      groupBy(
        filter(
          links,
          (item) =>
            item.target_class === "MediaAlbum" && item.target.type === "default"
        ),
        "target.id"
      ),
      (group) => {
        const album = group[0].target;
        album.links = group;
        return album;
      }
    );
    forEach(newAlbumsExisted, (newSt) => {
      let album = find(this.albumsExisted, { id: newSt.id });
      if (!album) {
        this.albumsExisted = concat(this.albumsExisted || [], newSt);
      } else {
        album.links = uniqBy(concat(album.links, newSt.links), "id");
      }
    });
    this.reset();
  }

  updateOpen(v) {
    this.$emit("update:open", v);
  }

  onSelectedAlbums(n, d) {
    this.albums = n;
    this.albumsExisted = d;
  }

  onSelectedCourses(n, d) {
    this.courses = n;
    this.coursesToDeleted = d;
  }
  onSelectedGroups(n, d) {
    this.groups = n;
    this.groupsToDeleted = d;
  }
  onSelectedTeachers(n, d) {
    this.teachers = n;
    this.teachersToDeleted = d;
  }
  onSelectedStudents(n, d) {
    console.log(n, d);
    this.students = n;
    this.studentsToDeleted = d;
  }

  save(noToast = false) {
    this.saveCourses((courses = null) => {
      this.saveLinks(courses, noToast);
    });
  }

  saveLinks(courses, noToast = false) {
    this.saveLinksCore(
      {
        students: this.students,
        studentsToDeleted: this.studentsToDeleted,
        teachers: this.teachers,
        teachersToDeleted: this.teachersToDeleted,
        groups: this.groups,
        groupsToDeleted: this.groupsToDeleted,
        courses: courses,
        coursesToDeleted: this.coursesToDeleted,
        albums: this.albums,
        albumsExisted: this.albumsExisted,
        medias: this.innerMedias,
      },
      noToast
    );
  }

  saveLinksCore(
    {
      students,
      studentsToDeleted,
      teachers,
      teachersToDeleted,
      groups,
      groupsToDeleted,
      courses,
      coursesToDeleted,
      albums,
      albumsToDeleted,
      medias,
    }: any,
    noToast = false
  ) {
    if (isEmpty(medias)) {
      this.$bus.$emit("media:saved", "links");
      return;
    }

    let links = [];
    // student
    links = concat(
      links,
      flatten(
        map(students || [], (student) => {
          return map(medias, (media) => {
            return {
              media_id: media.id,
              target_id: student.id,
              target_class: "Person",
            };
          });
        })
      )
    );
    links = concat(
      links,
      flatten(
        map(filter(studentsToDeleted, "links"), (student) => {
          const filteredLinks = filter(student.links, (link) => {
            return find(medias, { id: link.media_id });
          });
          return map(filteredLinks, (link) => {
            return {
              id: link.id,
              is_deleted: true,
              delete_or_recover_at: new Date(),
            };
          });
        })
      )
    );

    // teacher
    links = concat(
      links,
      flatten(
        map(teachers || [], (teacher) => {
          return map(medias, (media) => {
            return {
              media_id: media.id,
              target_id: teacher.id,
              target_class: "Person",
            };
          });
        })
      )
    );
    links = concat(
      links,
      flatten(
        map(filter(teachersToDeleted, "links"), (teacher) => {
          const filteredLinks = filter(teacher.links, (link) => {
            return find(medias, { id: link.media_id });
          });
          return map(filteredLinks, (link) => {
            return {
              id: link.id,
              is_deleted: true,
              delete_or_recover_at: new Date(),
            };
          });
        })
      )
    );

    // group
    links = concat(
      links,
      flatten(
        map(groups || [], (group) => {
          return map(medias, (media) => {
            return {
              media_id: media.id,
              target_id: group.id,
              target_class: "Group",
            };
          });
        })
      )
    );
    links = concat(
      links,
      flatten(
        map(filter(groupsToDeleted, "links"), (group) => {
          const filteredLinks = filter(group.links, (link) => {
            return find(medias, { id: link.media_id });
          });
          return map(filteredLinks, (link) => {
            return {
              id: link.id,
              is_deleted: true,
              delete_or_recover_at: new Date(),
            };
          });
        })
      )
    );

    // courses
    links = concat(
      links,
      flatten(
        map(courses || [], (album) => {
          return map(medias, (media) => {
            return {
              media_id: media.id,
              target_id: album.id,
              target_class: "MediaAlbum",
            };
          });
        })
      )
    );
    links = concat(
      links,
      flatten(
        map(filter(coursesToDeleted, "links"), (course) => {
          const filteredLinks = filter(course.links, (link) => {
            return find(medias, { id: link.media_id });
          });
          return map(filteredLinks, (link) => {
            return {
              id: link.id,
              is_deleted: true,
              delete_or_recover_at: new Date(),
            };
          });
        })
      )
    );

    // album
    links = concat(
      links,
      flatten(
        map(albums || [], (album) => {
          return map(medias, (media) => {
            return {
              media_id: media.id,
              target_id: album.id,
              target_class: "MediaAlbum",
            };
          });
        })
      )
    );
    links = concat(
      links,
      flatten(
        map(filter(albumsToDeleted, "links"), (album) => {
          const filteredLinks = filter(album.links, (link) => {
            return find(medias, { id: link.media_id });
          });
          return map(filteredLinks, (link) => {
            return {
              id: link.id,
              is_deleted: true,
              delete_or_recover_at: new Date(),
            };
          });
        })
      )
    );

    if (isEmpty(links)) {
      if (!noToast) {
        this.$hui.toast.info(
          this.hasExisted ? "已经保存" : "请选择至少一个目标去向"
        );
      }
      this.$bus.$emit("media:saved", "links");
      return;
    }

    links = this.addDeletedLinks(links);
    this.saveEntity({
      store: "mediaLink",
      res: links,
      query: {
        extras: "target",
      },
      success: (resp) => {
        !noToast && this.$hui.toast.info("保存成功");
        this.$bus.$emit("media:saved", "links");
        this.resetLinksExisted(resp.data);
        this.$emit("success");
      },
    });
  }

  addDeletedLinks(links) {
    if (!this.removeable) return links;
    return concat(
      links,
      map(filter(this.links, "id"), (link) => {
        return {
          id: link.id,
          is_deleted: true,
          delete_or_recover_at: new Date(),
        };
      })
    );
  }

  saveCourses(callback) {
    if (isEmpty(this.courses)) {
      callback && callback();
      return;
    }

    this.saveEntity({
      store: "mediaAlbum",
      res: map(this.courses, (course) => {
        return {
          title: course,
          type: "course",
        };
      }),
      success: (resp) => {
        callback && callback(resp.data);
      },
    });
  }
}
</script>
<style lang="scss" scoped>
.dialog {
  padding: 20px;
  background: #f5f5f5;

  .title {
    font-size: 24px;
    font-weight: 800;
    line-height: 2;
    text-align: center;
  }
}
.section {
  margin: 10px auto;
}
</style>
