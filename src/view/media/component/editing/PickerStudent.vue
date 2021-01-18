<template>
  <div class="wrapper picker-student">
    <picker-links
      title="作品所属学生"
      logoKey="target.avatar_url"
      titleKey="target.realname"
      :refresh.sync="refresh"
      :query="query"
      @click:item:delete="removeLink"
      @click:item:plus="open = true"
    />
    <ly-picker-person
      :open.sync="open"
      :query="{ only_student: true }"
      @selected="saveLinks"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Mixins, Prop } from "vue-property-decorator";
import SyncMixin from "@/mixin/SyncMixin";

import PickerLinks from "./PickerLinks.vue";
import LyPickerPerson from "@/view/layout/component/PickerPerson.vue";

import map from "lodash/map";

@Component({
  components: {
    PickerLinks,
    LyPickerPerson,
  },
})
export default class Home extends Mixins(SyncMixin) {
  @Prop({ type: Object, default: null }) media: any;

  open = false;
  refresh = false;

  get query() {
    return {
      only_student: true,
      media_id: this.media.id,
      target_class: "Person",
      extras: JSON.stringify({
        MediaLink: ["target"],
        Person: ["avatar_url"],
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

  saveLinks(persons) {
    this.saveEntity({
      res: map(persons, (person) => {
        return {
          target_class: "Person",
          target_id: person.id,
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
