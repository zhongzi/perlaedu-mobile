<template>
  <section class="container">
    <div class="ai-mask">
      <div class="content bottom">
        <div class="pinglun">
          <div class="btns">
            <div class="btn active">文本</div>
            <div class="btn">语音</div>
            <div class="btn">图片</div>
            <div class="btn">视频</div>
          </div>

          <div class="cont">
            <div class="textarea">
              <textarea
                name=""
                id=""
                placeholder="文本内容"
              ></textarea>
              <div class="count">0/100</div>
            </div>

            <media-item type="voice"></media-item>
            <media-item type="image"></media-item>
            <media-item type="video"></media-item>

          </div>

          <div class="send">发送</div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import UserItem from "~/components/UserItem.vue";
import MediaItem from "~/components/MediaItem2.vue";

export default {
  components: {
    /** 用户 */
    "user-item": UserItem,
    "media-item": MediaItem
  },

  data() {
    return {
      list: [
        {
          tag: "A",
          users: [
            {
              name: "全真弃子",
              binded: true,
              status: "已停课"
            }
          ]
        }
      ]
    };
  },

  head() {
    return {
      title: "AI教务"
    };
  }
};
</script>
<style lang="scss">
</style>
