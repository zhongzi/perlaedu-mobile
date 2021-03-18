<template>
  <div :class="b()">
    <div :class="b('title')" v-if="isEditing">语音 (最多{{ limit }}条)</div>
    <template v-for="media in medias">
      <div :class="b('media')" :key="media.id">
        <ai-audio-player :media="media" />
        <i
          class="iconfont icon-trash"
          v-if="isEditing"
          @click="removeMedia(media)"
        />
      </div>
    </template>
    <template v-if="enableRecorder">
      <ai-audio-recorder-wx
        v-if="isInWeixin"
        :kind="kind"
        :merchantId="merchantId"
        @input:media="addMedia"
      />
      <ai-audio-recorder
        v-else
        :kind="kind"
        :merchantId="merchantId"
        @input:media="addMedia"
      />
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Mixins } from "vue-property-decorator";

import SyncMixin from "@/mixin/SyncMixin";
import AiAudioPlayer from "./AiAudioPlayer.vue";
import AiAudioRecorder from "./AiAudioRecorder.vue";
import AiAudioRecorderWx from "./AiAudioRecorderWx.vue";

@Component({
  name: "ai-audio",
  components: {
    AiAudioPlayer,
    AiAudioRecorder,
    AiAudioRecorderWx,
  },
})
export default class Home extends Mixins(SyncMixin) {
  @Prop({ type: String, default: "" }) kind: string;
  @Prop({ type: Array, default: null }) medias: any;
  @Prop({ type: Number, default: 9 }) limit: number;
  @Prop({ type: Boolean, default: false }) isEditing: boolean;
  @Prop({ type: [String, Number], default: 0 }) merchantId: string | number;

  get isInWeixin() {
    return this.$weixin.isInWeixin();
  }

  get enableRecorder() {
    return this.isEditing && (this.medias || []).length <= this.limit;
  }

  addMedia(media) {
    this.$emit("changed", media, true);
  }

  removeMedia(media) {
    this.$emit("changed", media, false);
  }
}
</script>
<style lang="scss" scoped>
.ai-audio {
  &__title {
    font-size: 12px;
    line-height: 2;
    font-weight: 700;
  }

  &__media {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}
</style>
