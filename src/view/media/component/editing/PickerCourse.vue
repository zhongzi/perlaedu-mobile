<template>
  <div class="wrapper picker-course">
    <picker-links
      title="作品所属科目"
      logoKey="target.cover"
      titleKey="target.title"
      :refresh.sync="refresh"
      :query="query"
      @click:item:delete="removeLink"
      @click:item:plus="open = true"
    />
    <ly-picker-course :open.sync="open" @selected="addAlbumAndLinks" />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Mixins, Prop } from "vue-property-decorator";
import SyncMixin from "@/mixin/SyncMixin";

import PickerLinks from "./PickerLinks.vue";
import LyPickerCourse from "@/view/layout/component/PickerCourse.vue";

import map from "lodash/map";

@Component({
  components: {
    PickerLinks,
    LyPickerCourse,
  },
})
export default class Home extends Mixins(SyncMixin) {
  @Prop({ type: Object, default: null }) media: any;

  open = false;
  refresh = false;

  get query() {
    return {
      media_id: this.media.id,
      target_class: "MediaAlbum",
      "target_id.MediaAlbum.type": "course",
      extras: JSON.stringify({
        MediaLink: ["target"],
        MediaAlbum: ["cover"],
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

  addAlbumAndLinks(courses) {
    this.saveEntity({
      store: "mediaAlbum",
      res: map(courses, (course) => {
        return {
          title: course,
          type: "course",
        };
      }),
      success: (resp) => {
        this.saveLinks(resp.data);
      },
    });
  }

  saveLinks(albums) {
    this.saveEntity({
      res: map(albums, (album) => {
        return {
          target_class: "MediaAlbum",
          target_id: album.id,
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
