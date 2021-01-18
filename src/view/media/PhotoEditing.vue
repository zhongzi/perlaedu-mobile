<template>
  <div class="wrapper photo-editing">
    <photo :media="media" @refresh="resetMediaId" />
    <div
      v-if="innerMedias.length > 0"
      class="animate__animated animate__fadeInUp"
    >
      <ai-tab v-model="curTabIdx" :tabs="tabs" />
      <div class="settings">
        <photo-basic v-show="curTab.value === 'basic'" :medias="innerMedias" />
        <photo-link v-show="curTab.value === 'link'" :medias="innerMedias" />
      </div>
    </div>
    <ai-fixed-footer>
      <ai-submit-actions
        cancelLabel="取消"
        submitLabel="保存"
        @cancel="goBack"
        @submit="save"
      />
    </ai-fixed-footer>
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
import AiSubmitActions from "@/view/component/AiSubmitActions.vue";
import AiFixedFooter from "@/view/component/AiFixedFooter.vue";

import cloneDeep from "lodash/cloneDeep";
import isEmpty from "lodash/isEmpty";
import concat from "lodash/concat";
import uniq from "lodash/uniq";
import xor from "lodash/xor";

@Component({
  components: {
    AiTab,
    AiSubmitActions,
    AiFixedFooter,
    Photo,
    PhotoBasic,
    PhotoLink,
    PhotoPermission,
  },
})
export default class Home extends Mixins(SyncMixin) {
  curTabIdx: number = 0;

  mediaId: number = null;
  media: any = null;
  medias: any = null;

  isInSaving = false;

  get tabs() {
    return [
      { label: "归属关系", value: "link" },
      { label: "作品描述", value: "basic" },
    ];
  }

  get curTab() {
    return this.tabs[this.curTabIdx];
  }

  get innerMedias() {
    return concat(this.medias || [], this.media || []);
  }

  created() {
    this.$bus.$on("media:mutil:uploaded", (v) => {
      this.medias = cloneDeep(v);
    });
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

  save() {
    if (this.isInSaving) return;
    this.isInSaving = true;

    let savedItems = [];
    this.$bus.$on("media:saved", (item) => {
      savedItems = uniq(concat(savedItems, item));
      if (xor(savedItems, ["basic", "links"]).length === 0) {
        this.$hui.toast.info("保存成功");
        this.$bus.$off("media:saved");
        this.isInSaving = false;
        this.goBack();
        return;
      }
    });
    this.$bus.$emit("media:saving");
  }

  goBack() {
    this.$router.go(-1);
    return;
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
  min-height: 85vh;

  .settings {
    padding: 20px;
  }
}
</style>
