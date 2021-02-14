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
    <!--
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
-->
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
import debounce from "lodash/debounce";
import isEmpty from "lodash/isEmpty";
import concat from "lodash/concat";
import map from "lodash/map";
import merge from "lodash/merge";
import cloneDeep from "lodash/cloneDeep";

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
  @Prop({ type: Array, default: null }) medias: any;

  innerMedia: any = {};
  confirmInnerMedia: any = {};

  created() {
    this.resetInnerMedia();
    this.$bus.$on("media:saving", () => {
      this.confirm(true);
    });
  }

  @Watch("medias", { deep: true })
  onMediaChanged() {
    this.resetInnerMedia();
    this.save();
  }

  resetInnerMedia() {
    this.innerMedia = {
      title: _get(this.medias, "[0].title"),
      description: _get(this.medias, "[0].description"),
      published_at: _get(this.medias, "[0].published_at"),
      enabled_privacy: _get(this.medias, "[0].enabled_privacy", false),
      enabled_reply: _get(this.medias, "[0].enabled_reply", true),
    };
  }

  confirm(noToast = false) {
    this.confirmInnerMedia = cloneDeep(this.innerMedia);
    this.save(noToast);
  }

  save(noToast = false) {
    if (isEmpty(this.medias) || isEmpty(this.confirmInnerMedia)) {
      this.$bus.$emit("media:saved", "basic");
      return;
    }

    this.saveEntity({
      store: "media",
      res: map(this.medias, (media) => {
        return merge({ id: media.id }, this.confirmInnerMedia);
      }),
      success: () => {
        !noToast && this.$hui.toast.info("保存成功");
        this.$bus.$emit("media:saved", "basic");
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
