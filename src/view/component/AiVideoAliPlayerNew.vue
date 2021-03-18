<template>
  <div :class="b()">
    <ai-card @click.native.stop="showDialog = true">
      <template v-slot:header>
        <img :class="b('cover')" :src="cover" />
      </template>
      <template v-slot:footer>
        <div :class="b('title')" v-if="showInfo">
          <i class="iconfont icon-video" />
          <span> {{ media.title }} </span>
        </div>
      </template>
    </ai-card>
    <ai-dialog v-model="showDialog">
      <ai-video-ali-player-base :media="innerMedia" :class="b('player')" />
    </ai-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Mixins, Watch } from "vue-property-decorator";

import SyncMixin from "@/mixin/SyncMixin";

import AiCard from "./AiCard.vue";
import AiDialog from "./AiDialog.vue";
import AiVideoAliPlayerBase from "./AiVideoAliPlayerBase.vue";

import _get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import cloneDeep from "lodash/cloneDeep";

@Component({
  name: "ai-video-ali-player-new",
  components: {
    AiCard,
    AiDialog,
    AiVideoAliPlayerBase,
  },
})
export default class Home extends Mixins(SyncMixin) {
  @Prop({ type: Object, default: null }) media: any;
  @Prop({ type: Boolean, default: false }) showInfo: boolean;

  innerMedia: any = null;
  showDialog: boolean = false;

  get cover() {
    const cover = _get(this.media, "cover");
    if (!isEmpty(cover)) return cover;
    return _get(this.media, "file.cover");
  }

  created() {
    this.ensurePlayAuth();
  }

  @Watch("media", { deep: true })
  onMediaChanged() {
    this.ensurePlayAuth();
  }

  ensurePlayAuth() {
    if (isEmpty(this.media)) return;

    if (!isEmpty(_get(this.media, "file.play_auth"))) {
      this.innerMedia = cloneDeep(this.media);
      return;
    }

    this.loadEntity({
      store: "media",
      id: this.media.id,
      query: {
        extras: JSON.stringify({
          Media: ["file"],
          MediaFile: ["play_auth", "videoid"],
        }),
      },
      success: (resp) => {
        this.innerMedia = cloneDeep(this.media);
        this.innerMedia.file = this.innerMedia.file || {};
        this.innerMedia.file.videoid = _get(resp, "data.file.videoid");
        this.innerMedia.file.play_auth = _get(resp, "data.file.play_auth");
      },
    });
  }
}
</script>
<style lang="scss" scoped>
.ai-video-ali-player-new {
  height: 100%;
  width: 100%;

  & ::v-deep .ai-card {
    border-radius: 0px;
  }

  & ::v-deep .ai-card__header {
    height: 100%;
  }

  &__cover {
    object-fit: cover;
  }
}
</style>
