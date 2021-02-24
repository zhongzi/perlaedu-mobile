<template>
  <div class="wrapper picker-group">
    <picker-items
      title="加入到班级相册"
      :items="groups"
      labelKey="name"
      logoKey=""
      @icon:delete:clicked="onClickDelete"
      @icon:plus:clicked="onClickPlus"
    />
    <ly-picker-group :open.sync="open" @selected="addGroups" />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Mixins, Prop, Watch } from "vue-property-decorator";
import SyncMixin from "@/mixin/SyncMixin";

import PickerItems from "./PickerItems.vue";
import LyPickerGroup from "@/view/layout/component/PickerGroup.vue";

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
    LyPickerGroup,
  },
})
export default class Home extends Mixins(SyncMixin) {
  @Prop({ type: Array, default: null }) groupsExisted: any;

  open = false;
  groups: any = null;

  created() {
    this.initAlbums();
    this.addGroups(this.groupsExisted);
    this.$bus.$on("picker:clear", () => {
      this.groups = [];
    });
  }

  @Watch("groups", { deep: true })
  onGroupsChanged() {
    this.$emit(
      "selected",
      differenceBy(this.groups, this.groupsExisted || [], "id"),
      differenceBy(this.groupsExisted || [], this.groups, "id")
    );
  }

  @Watch("groupsExisted", { deep: true })
  onGroupsExistedChanged() {
    this.addGroups(this.groupsExisted);
  }

  initAlbums() {
    try {
      const albumsStr = this.$route.query.albums as string;
      if (isEmpty(albumsStr)) return;
      const albums = JSON.parse(albumsStr);
      albums.forEach((album) => {
        if (album.type === "group") {
          this.groups = concat(this.groups || [], {
            id: parseInt(album.id),
            name: album.name,
          });
        }
      });
    } catch (e) {
      console.log(e);
    }
  }

  onClickDelete(group) {
    this.groups = filter(this.groups || [], (item) => {
      return item.id !== group.id;
    });
  }

  onClickPlus() {
    this.open = true;
  }

  addGroups(groups) {
    if (isEmpty(groups)) return;

    this.groups = concat(this.groups || [], groups || []);
    this.groups = uniqBy(this.groups || [], "id");
    this.open = false;
  }
}
</script>
<style lang="scss" scoped></style>
