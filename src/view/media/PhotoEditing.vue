<template>
  <div class="wrapper photo-editing">
    <photo :media="media" @refresh="resetMediaId" />
    <div v-if="media && media.id" class="animate__animated animate__fadeInUp">
      <ai-tab v-model="curTabIdx" :tabs="tabs" />
      <div class="settings">
        <photo-basic v-if="curTab.value === 'basic'" :media="media" />
        <photo-link v-if="curTab.value === 'link'" :media="media" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Mixins, Watch } from "vue-property-decorator";

import SyncMixin from "@/mixin/SyncMixin";

import AiTab from "@/view/component/AiTab.vue";

import Photo from "./component/editing/Photo.vue";
import PhotoBasic from "./component/editing/PhotoBasic.vue";
import PhotoLink from "./component/editing/PhotoLink.vue";
import PhotoPermission from "./component/editing/PhotoPermission.vue";

import cloneDeep from "lodash/cloneDeep";

@Component({
  components: {
    AiTab,
    Photo,
    PhotoBasic,
    PhotoLink,
    PhotoPermission,
  },
})
export default class Home extends Mixins(SyncMixin) {
  curTabIdx: number = 0;
  tabs: any = [
    { label: "作品描述", value: "basic" },
    { label: "归属关系", value: "link" },
  ];

  mediaId: number = null;
  media: any = null;

  get curTab() {
    return this.tabs[this.curTabIdx];
  }

  created() {
    this.resetMediaId();
  }

  @Watch("$route", { deep: true })
  onRouteChanged() {
    this.resetMediaId();
  }

  @Watch("mediaId")
  onMediaIdChanged() {
    this.load();
  }

  resetMediaId(mediaId = null) {
    this.mediaId = mediaId || parseInt(this.$route.params.mediaId);
  }

  load() {
    if (!this.mediaId || this.mediaId <= 0) return;

    this.loadEntity({
      store: "media",
      id: this.mediaId,
      query: {
        extras: "frame,file,url",
      },
      success: (resp) => {
        this.media = cloneDeep(resp.data);
      },
    });
  }
}
</script>
<style lang="scss" scoped>
.photo-editing {
  .settings {
    padding: 20px;
  }
}
</style>
