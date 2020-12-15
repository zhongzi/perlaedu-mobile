<template>
  <section class="container">
    <div class="jzy">
      <div class="bd">
        <div class="jzy-item">
          <filed-item
            label="作业部门"
            type="picker"
            placeholder="武当派-张三丰亲传"
          ></filed-item>
        </div>
        <div class="jzy-item">
          <filed-item
            label="文字内容"
            type="text"
            placeholder="请输入文字内容"
          ></filed-item>
        </div>
        <div class="jzy-item">
          <media-item
            label="语音（最多9条）"
            type="voice"
          ></media-item>
        </div>
        <div class="jzy-item">
          <media-item
            label="照片（最多9条）"
            type="image"
          ></media-item>
        </div>
        <div class="jzy-item">
          <media-item
            label="视频（最多9条）"
            type="video"
          ></media-item>
        </div>
      </div>

      <button-group :buttons="buttons"></button-group>
    </div>
  </section>
</template>

<script>
import MediaItem from "~/components/MediaItem2.vue";
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
