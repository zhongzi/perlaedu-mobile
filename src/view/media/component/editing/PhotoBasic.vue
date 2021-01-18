<template>
  <div class="wrapper editing-basic">
    <ai-input class="section" label="作品标题" v-model="innerMedia.title" />
    <ai-input
      class="section"
      label="作品描述"
      v-model="innerMedia.description"
    />
    <ai-input-date
      class="section"
      label="创作时间"
      v-model="innerMedia.published_at"
    />
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
import AiInput from "@/view/component/AiInput.vue";
import AiInputDate from "@/view/component/AiInputDate.vue";
import AiInputTextarea from "@/view/component/AiInputTextarea.vue";
import AiInputSwitch from "@/view/component/AiInputSwitch.vue";
import AiSubmitActions from "@/view/component/AiSubmitActions.vue";

import _get from "lodash/get";

@Component({
  components: {
    AiCell,
    AiInputSwitch,
    AiInput,
    AiInputDate,
    AiInputTextarea,
    AiSubmitActions,
  },
})
export default class Home extends Mixins(SyncMixin) {
  @Prop({ type: Object, default: null }) media: any;

  innerMedia: any = {};

  created() {
    this.store = "media";
    this.resetInnerMedia();
  }

  @Watch("media", { deep: true })
  onMediaChanged() {
    this.resetInnerMedia();
  }

  resetInnerMedia() {
    this.innerMedia = {
      id: _get(this.media, "id"),
      title: _get(this.media, "title"),
      description: _get(this.media, "description"),
      published_at: _get(this.media, "published_at"),
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
<style lang="scss" scoped>
.editing-basic {
  .section {
    margin: 0px auto 10px;
  }
}
</style>
