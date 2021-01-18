<template>
  <div class="wrapper picker-group">
    <picker-items
      title="班级相册"
      :items="groups"
      labelKey=""
      logoKey=""
      valueKey=""
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

@Component({
  components: {
    PickerItems,
    LyPickerGroup,
  },
})
export default class Home extends Mixins(SyncMixin) {
  open = false;
  groups: any = null;

  @Watch("groups", { deep: true })
  onGroupsChanged() {
    this.$emit("selected", this.groups);
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
    this.groups = concat(this.groups || [], groups || []);
    this.groups = uniqBy(this.groups || [], "id");
    this.open = false;
  }
}
</script>
<style lang="scss" scoped></style>
