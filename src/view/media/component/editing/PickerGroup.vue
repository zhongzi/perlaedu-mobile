<template>
  <div class="wrapper picker-group">
    <picker-links
      title="作品所属班级"
      titleKey="target.name"
      :refresh.sync="refresh"
      :query="query"
      @click:item:delete="removeLink"
      @click:item:plus="open = true"
    />
    <ly-picker-group :open.sync="open" @selected="saveLinks" />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Mixins, Prop } from "vue-property-decorator";
import SyncMixin from "@/mixin/SyncMixin";

import PickerLinks from "./PickerLinks.vue";
import LyPickerGroup from "@/view/layout/component/PickerGroup.vue";

import map from "lodash/map";

@Component({
  components: {
    PickerLinks,
    LyPickerGroup,
  },
})
export default class Home extends Mixins(SyncMixin) {
  @Prop({ type: Object, default: null }) media: any;

  open = false;
  refresh = false;

  get query() {
    return {
      media_id: this.media.id,
      target_class: "Group",
      extras: JSON.stringify({
        MediaLink: ["target"],
      }),
    };
  }

  created() {
    this.store = "mediaLink";
  }

  removeLink(link) {
    this.deleteEntity({
      id: link.id,
      success: () => {
        this.refresh = true;
      },
    });
  }

  saveLinks(groups) {
    this.saveEntity({
      res: map(groups, (group) => {
        return {
          target_class: "Group",
          target_id: group.id,
          media_id: this.media.id,
        };
      }),
      success: () => {
        this.open = false;
        this.refresh = true;
      },
    });
  }
}
</script>
<style lang="scss" scoped></style>
