<template>
  <section class="container">
    <div class="kcxq">
      <div class="hd">
        在线课程
        <div class="mask">
          <span class="iconfont iconsuo"></span>
        </div>
      </div>

      <div class="bd ai-content">
        <div class="course-info">
          <div class="name">
            <div class="txt">九阴白骨爪-公开课</div>
            <span class="iconfont iconxiugai"></span>
          </div>
          <div class="desc">单个视频</div>
        </div>

        <div class="course-list">
          <div class="name">介绍视频</div>
          <div class="list">
            <div class="item">
              <div class="video">
                <div class="mask">
                  <span class="iconfont iconbofang"></span>
                </div>
              </div>
              <div class="txt">九阴白骨爪 课程</div>
            </div>
          </div>
        </div>

        <div class="course-handle">
          <div class="handle-item">
            <div class="ico eye"></div> 浏览:3239
          </div>
          <div class="handle-item">
            <div class="ico share"></div> 浏览:3239
          </div>
          <div class="handle-item">
            <div class="ico share"></div> 浏览:3239
          </div>
        </div>

        <div class="course-desc">
          <div class="name">介绍视频</div>
          <div class="cont">“根据《中国居民膳食指南2012版》的说明, 我国居民维生素C的每日推荐摄入量为100mg。当然这是针对全国居民进行统计的量</div>
        </div>
      </div>

      <button-group
        :buttons="buttons"
        className="transparent"
      >
      </button-group>
    </div>
  </section>

</template>

<script>
import ArrowItem from "~/components/ArrowItem";
import ButtonGroup from "~/components/ButtonGroup";
import HandlesArea from "~/components/HandlesArea";

export default {
  components: {
    "arrow-item": ArrowItem,
    "button-group": ButtonGroup,
    "handles-area": HandlesArea
  },
  head() {
    return {
      title: "机构介绍"
    };
  },
  data() {
    return {
      buttons: [
        {
          text: "解锁课程",
          type: "primary",
          width: "306",
          icon: "iconsuo"
        }
      ]
    };
  }
};
</script>
<style lang="scss">
</style>
