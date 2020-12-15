<template>
  <section class="container">
    <div class="fxx">
      <div class="user-list">
        <div class="tit">
          收件人
          <div class="count">
            5
          </div>

          <span class="iconfont iconrenshu"></span>
        </div>
        <div class="cont">
          <div class="user-item">
            <div class="avatar"></div>
            <div class="name">张翠山</div>
            <div class="trigger">×</div>
          </div>

          <div class="user-item">
            <div class="avatar"></div>
            <div class="name">张翠山</div>
            <div class="trigger">×</div>
          </div>

          <div class="user-item">
            <div class="avatar"></div>
            <div class="name">张翠山</div>
            <div class="trigger">×</div>
          </div>

          <div class="user-item">
            <div class="avatar"></div>
            <div class="name">张翠山</div>
            <div class="trigger">×</div>
          </div>

          <div class="add-trigger">
            <div class="ico">+</div>
            <div>添加</div>
          </div>
        </div>
      </div>

      <div class="content ai-content">
        <div class="ai-row">
          <div class="ai-col flex-1">
            <filed-item
              label="消息类型"
              value="武当派 真武七截阵"
              type="picker"
            ></filed-item>
          </div>
        </div>

        <div class="ai-row">
          <div class="ai-col flex-1">
            <filed-item
              label="文字内容"
              value="武当派 真武七截阵真武七截阵真武七截阵真武七截阵真武七截阵真武七截阵真武七截阵真武七截阵真武七截阵"
              type="textarea"
              maxlength="3000"
            ></filed-item>
          </div>
        </div>

        <div class="ai-row">
          <div class="ai-col flex-1">
            <media-item
              label="语音（最多9条）"
              type="voice"
            ></media-item>
          </div>
        </div>

        <div class="ai-row">
          <div class="ai-col flex-1">
            <media-item
              label="照片（最多9条）"
              type="image"
            ></media-item>
          </div>
        </div>

        <div class="ai-row">
          <div class="ai-col flex-1">
            <media-item
              label="视频（最多9条）"
              type="video"
            ></media-item>
          </div>
        </div>
      </div>

      <button-group :buttons="buttons"></button-group>
    </div>
  </section>
</template>

<script>
import FiledItem from "~/components/FiledItem.vue";
import MediaItem from "~/components/MediaItem2.vue";
import ButtonGroup from "~/components/ButtonGroup.vue";

export default {
  components: {
    "filed-item": FiledItem,
    "media-item": MediaItem,
    "button-group": ButtonGroup
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
