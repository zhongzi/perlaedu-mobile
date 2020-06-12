<template>
  <div class="wrapper video">
    <ai-video-ali-uploader
      :videoId="video.video_id"
      @uploaded="onUploaded"
      v-if="isNew || this.video.id"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Mixins } from "vue-property-decorator";

import SyncMixin from "@/mixin/SyncMixin";

import AiVideoAliUploader from "@/view/component/AiVideoAliUploader.vue";

@Component({
  components: {
    AiVideoAliUploader,
  },
})
export default class Home extends Mixins(SyncMixin) {
  get video() {
    return this.entity;
  }

  get isNew() {
    return this.id === "new";
  }

  created() {
    this.store = "websiteVideo";
    this.id = this.$route.params.videoId;
    if (!this.isNew) {
      this.loadVideo();
    }
  }

  loadVideo() {
    this.loadEntity({
      id: this.id,
    });
  }

  onUploaded(video) {
    this.saveEntity({
      res: {
        id: !this.isNew && this.id,
        video_id: video.id,
        merchant_id: this.$auth.user.curr_merch_id,
      },
      success: () => {
        this.$nextTick(() => {
          this.$router.go(-1);
        });
      },
      failure: (err) => {
        this.$hui.toast.info(err.response.data.message);
      },
    });
  }
}
</script>
<style lang="scss" scoped>
.video {
  min-height: 100vh;
}
</style>
