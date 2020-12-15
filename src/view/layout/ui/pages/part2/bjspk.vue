<template>
  <section class="container ai-background">
    <div class="bjspk">
      <div class="hd">
        <div class="btn">新增一节视频课</div>
      </div>
      <div class="bd">
        <div class="task-list">
          <div class="task-item ai-content">
            <div class="task-info">
              <div class="info">
                <div class="name">
                  本节课程标题
                </div>
                <div class="date">
                  武当派 真武七截阵
                </div>
              </div>
              <div class="delete">
                <div class="ico">
                  <span class="iconfont iconshanchu"></span>
                </div>
              </div>
            </div>
            <div class="video-list">
              <div class="title">
                本节课包含视频
              </div>

              <div class="cont">
                <div class="video-item">
                  <div class="cover">
                    <span class="iconfont iconshanchu"></span>
                  </div>
                </div>
                <div class="video-item empty">
                  <span class="iconfont iconjiahao
                  "></span>
                </div>
              </div>
            </div>
          </div>
          <div class="task-item ai-content">
            <div class="add-btn">插入一节视频课</div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import ArrowItem from "~/components/ArrowItem.vue";
import FiledItem from "~/components/FiledItem.vue";

export default {
  components: {
    "arrow-item": ArrowItem,
    "filed-item": FiledItem
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
