<template>
  <div class="wrapper picker-teacher">
    <picker-items
      title="老师相册"
      :items="teachers"
      labelKey="realname"
      logoKey="avatar_url"
      @icon:delete:clicked="onClickDelete"
      @icon:plus:clicked="onClickPlus"
    />
    <ly-picker-person
      :open.sync="open"
      :query="{ only_teacher: true }"
      @selected="addTeachers"
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
  @Prop({ type: Array, default: null }) teachersExisted: any;

  open = false;
  teachers: any = null;

  created() {
    this.initAlbums();
    this.addTeachers(this.teachersExisted);
    this.$bus.$on("picker:clear", () => {
      this.teachers = [];
    });
  }

  @Watch("teachers", { deep: true })
  onTeachersChanged() {
    this.$emit(
      "selected",
      differenceBy(this.teachers, this.teachersExisted || [], "id"),
      differenceBy(this.teachersExisted || [], this.teachers, "id")
    );
  }

  @Watch("teachersExisted", { deep: true })
  onTeachersExistedChanged() {
    this.addTeachers(this.teachersExisted);
  }

  initAlbums() {
    try {
      const albumsStr = this.$route.query.albums as string;
      if (isEmpty(albumsStr)) return;
      const albums = JSON.parse(albumsStr);
      albums.forEach((album) => {
        if (album.type === "teacher") {
          this.teachers = concat(this.teachers || [], {
            id: parseInt(album.id),
            realname: album.name,
          });
        }
      });
    } catch (e) {
      console.log(e);
    }
  }

  onClickDelete(teacher) {
    this.teachers = filter(this.teachers || [], (item) => {
      return item.id !== teacher.id;
    });
  }

  onClickPlus() {
    this.open = true;
  }

  addTeachers(teachers) {
    if (isEmpty(teachers)) return;

    this.teachers = concat(this.teachers || [], teachers || []);
    this.teachers = uniqBy(this.teachers || [], "id");
    this.open = false;
  }
}
</script>
<style lang="scss" scoped></style>
