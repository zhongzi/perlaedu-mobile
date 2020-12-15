<template>
  <section class="container ai-background">
    <div class="xzsp">
      <div class="hd">
        <div class="btn">上传视频</div>
      </div>
      <div class="bd ai-content">
        <cube-scroll>
          <video-item
            v-for="(item, index) in [1,1,1,1,1,1,1]"
            :key="index"
          ></video-item>
        </cube-scroll>
      </div>
      <button-group :buttons="buttons"></button-group>
    </div>
  </section>
</template>

<script>
import VideoItem from "~/components/VideoItem.vue";
import ButtonGroup from "~/components/ButtonGroup.vue";

export default {
  components: {
    "video-item": VideoItem,
    "button-group": ButtonGroup
  },
  head() {
    return {
      title: "选择视频"
    };
  },
  data() {
    return {
      buttons: [
        {
          text: "取消",
          type: "cancel",
          width: "126"
        },
        {
          text: "确认（1）",
          type: "primary",
          width: "160"
        }
      ]
    };
  }
};
</script>
<style lang="scss">
</style>
