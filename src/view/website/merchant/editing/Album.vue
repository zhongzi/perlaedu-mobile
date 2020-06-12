<template>
  <album-photos-management :album="album" class="wrapper editing-album">
    <template v-slot:header>
      <ai-input-switchable
        v-model="title"
        @onBlur="onBlur"
        mode="unnormal"
        class="title"
      />
    </template>
  </album-photos-management>
</template>

<script lang="ts">
import { Component, Vue, Mixins, Watch } from "vue-property-decorator";

import SyncMixin from "@/mixin/SyncMixin";

import AiInputSwitchable from "@/view/component/AiInputSwitchable.vue";

import AlbumPhotosManagement from "./component/AlbumPhotosManagement.vue";

@Component({
  components: {
    AiInputSwitchable,
    AlbumPhotosManagement,
  },
})
export default class Home extends Mixins(SyncMixin) {
  title: string = "";

  get album() {
    return this.entity;
  }

  created() {
    this.store = "album";
    this.id = this.$route.params.albumId;
    this.loadEntity();
  }

  @Watch("album", { deep: true })
  onAlbumChanged() {
    this.title = this.album.title;
  }

  onBlur() {
    this.saveEntity({
      res: {
        id: this.id,
        title: this.title,
      },
      success: () => {
        this.$hui.toast.success("修改成功");
      },
    });
  }
}
</script>

<style lang="scss" scoped>
.editing-album {
  height: 100vh;
}
</style>
