<template>
  <section class="container">
    <div class="scsp">
      <div class="bd">
        <div class="scsp-item">
          <media-item
            label="上传视频"
            type="video"
          ></media-item>
        </div>
        <div class="scsp-item">
          <filed-item
            label="视频名称"
            type="text"
            placeholder="请输入视频名称"
          ></filed-item>
        </div>
        <div class="scsp-item">
          <filed-item
            label="视频描述"
            type="text"
            placeholder="请输入视频描述"
          ></filed-item>
        </div>
      </div>

      <button-group :buttons="buttons"></button-group>
    </div>
  </section>
</template>

<script>
import MediaItem from "~/components/MediaItem.vue";
import FiledItem from "~/components/FiledItem.vue";
import ButtonGroup from "~/components/ButtonGroup.vue";

export default {
  components: {
    "media-item": MediaItem,
    "filed-item": FiledItem,
    "button-group": ButtonGroup
  },
  head() {
    return {
      title: "AI教务"
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
          text: "确定",
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
