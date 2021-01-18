<template>
  <div class="wrapper editing-permisssion">
    <ai-cell title="设为私密" subtitle="仅作品所属人及管理员可见">
      <template v-slot:right>
        <ai-input-switch v-model="innerMedia.enabled_privacy" />
      </template>
    </ai-cell>
    <ai-cell title="允许留言" subtitle="接受用户留言，作品所属人可删除">
      <template v-slot:right>
        <ai-input-switch v-model="innerMedia.enabled_reply" />
      </template>
    </ai-cell>
    <ai-submit-actions submitLabel="保存" @submit="save" />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Mixins, Watch } from "vue-property-decorator";

import SyncMixin from "@/mixin/SyncMixin";

import AiCell from "@/view/component/AiCell.vue";
import AiInputSwitch from "@/view/component/AiInputSwitch.vue";
import AiSubmitActions from "@/view/component/AiSubmitActions.vue";

import _get from "lodash/get";

@Component({
  components: {
    AiCell,
    AiInputSwitch,
    AiSubmitActions,
  },
})
export default class Home extends Mixins(SyncMixin) {
  @Prop({ type: Object, default: null }) media: any;

  innerMedia: any = {};

  created() {
    this.resetInnerMedia();
  }

  @Watch("media", { deep: true })
  onMediaChanged() {
    this.resetInnerMedia();
  }

  resetInnerMedia() {
    this.innerMedia = {
      id: _get(this.media, "id"),
      enabled_privacy: _get(this.media, "enabled_privacy", false),
      enabled_reply: _get(this.media, "enabled_reply", true),
    };
  }

  save() {
    if (!this.innerMedia.id || this.innerMedia.id <= 0) return;

    this.saveEntity({
      store: "media",
      id: this.innerMedia.id,
      res: this.innerMedia,
      success: (resp) => {
        this.commitChanges(this.innerMedia.id, this.innerMedia);
      },
    });
  }
}
</script>
<style lang="scss" scoped></style>
