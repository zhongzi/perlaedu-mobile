<template>
  <ai-dialog
    class="wrapper add-links"
    :value="open"
    :hideOnBlur="false"
    @input="updateOpen"
  >
    <div class="dialog">
      <div class="title">{{ title }}</div>
      <picker-student class="section" @selected="(v) => (students = v)" />
      <picker-teacher class="section" @selected="(v) => (teachers = v)" />
      <picker-group class="section" @selected="(v) => (groups = v)" />
      <picker-course class="section" @selected="(v) => (courses = v)" />
      <picker-album class="section" @selected="(v) => (albums = v)" />
      <ai-submit-actions @cancel="updateOpen(false)" @submit="save" />
    </div>
  </ai-dialog>
</template>

<script lang="ts">
import { Component, Vue, Prop, Mixins } from "vue-property-decorator";

import SyncMixin from "@/mixin/SyncMixin";

import AiDialog from "@/view/component/AiDialog.vue";
import AiSubmitActions from "@/view/component/AiSubmitActions.vue";

import PickerStudent from "./PickerStudent.vue";
import PickerTeacher from "./PickerTeacher.vue";
import PickerGroup from "./PickerGroup.vue";
import PickerCourse from "./PickerCourse.vue";
import PickerAlbum from "./PickerAlbum.vue";

import isEmpty from "lodash/isEmpty";
import concat from "lodash/concat";
import map from "lodash/map";
import flatten from "lodash/flatten";

@Component({
  components: {
    AiDialog,
    AiSubmitActions,
    PickerStudent,
    PickerTeacher,
    PickerGroup,
    PickerCourse,
    PickerAlbum,
  },
})
export default class Home extends Mixins(SyncMixin) {
  @Prop({ type: Array, default: null }) links: any;
  @Prop({ type: String, default: null }) title: boolean;
  @Prop({ type: Boolean, default: false }) open: boolean;
  @Prop({ type: Boolean, default: false }) removeable: boolean;

  students: any = null;
  teachers: any = null;
  groups: any = null;
  courses: any = null;
  albums: any = null;

  curTitle = null;

  get isActivated() {
    return this.curTitle === this.title;
  }

  created() {
    this.$bus.$on("ai:popup", (v) => {
      this.isActivated && this.updateOpen(!v);
    });

    this.$bus.$on("add:links:title", (v) => {
      this.curTitle = v;
    });
  }

  updateOpen(v) {
    this.$emit("update:open", v);
  }

  save() {
    this.saveCourses(() => {
      this.saveLinks();
    });
  }

  saveLinks() {
    let links = [];
    links = concat(
      links,
      flatten(
        map(this.students || [], (student) => {
          return map(this.links, (link) => {
            return {
              media_id: link.media_id,
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
        map(this.teachers || [], (teacher) => {
          return map(this.links, (link) => {
            return {
              media_id: link.media_id,
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
        map(this.groups || [], (group) => {
          return map(this.links, (link) => {
            return {
              media_id: link.media_id,
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
        map(this.albums || [], (album) => {
          return map(this.links, (link) => {
            return {
              media_id: link.media_id,
              target_id: album.id,
              target_class: "MediaAlbum",
            };
          });
        })
      )
    );
    if (isEmpty(links)) {
      this.$hui.toast.info("请选择至少一个目标去向");
      return;
    }

    links = this.addDeletedLlinks(links);
    this.saveEntity({
      store: "mediaLink",
      res: links,
      success: () => {
        this.students = null;
        this.teachers = null;
        this.groups = null;
        this.albums = null;
        this.courses = null;

        this.$emit("success");
      },
    });
  }

  addDeletedLlinks(links) {
    if (!this.removeable) return links;
    return concat(
      links,
      map(this.links, (link) => {
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
        this.albums = concat(this.albums || [], resp.data);
        callback && callback();
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
  .section {
    margin: 10px auto;
  }
}
</style>
