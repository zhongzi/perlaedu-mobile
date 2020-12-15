<template>
  <div class="video-item">
    <div class="top">
      2020-01-23 14:26
    </div>
    <div class="mid">
      <div class="info">
        <div class="video">
          <div class="mask">
            <span class="iconfont iconbofang"></span>
          </div>
        </div>
        <div class="name">武当派 真武七截阵 </div>
      </div>
      <div class="check">
        <check-box size="big"></check-box>
      </div>
    </div>
  </div>
</template>
<script>
import CheckBox from "~/components/CheckBox.vue";
export default {
  components: {
    "check-box": CheckBox
  }
};
</script>
<style lang="scss" scoped>
.video-item {
  padding: 1.3rem 0 1.5rem;
  border-bottom: .1rem solid rgba(151, 151, 151, .1);
  .top {
    color: #9b9b9b;
    font-size: 1.2rem;
  }

  .mid {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding-top: .5rem;

    .info {
      display: flex;
      .video {
        position: relative;
        overflow: hidden;
        width: 8.9rem;
        height: 6rem;
        margin-right: 1.3rem;
        border-radius: .8rem;
        background: linear-gradient(
        234deg,
        rgba(255, 160, 47, 1) 0%,
        rgba(255, 189, 38, 1) 100%
        );

        .mask {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, .6);

          .iconfont {
            position: absolute;
            top: 50%;
            left: 50%;
            color: #ffffff;
            font-size: 2rem;
            transform: translate(-50%, -50%);
          }
        }
      }

      .name {
        padding-top: .5rem;
        color: #4a4a4a;
        font-size: 1.4rem;
        font-weight: bold;
      }
    }

    .check {
      padding-top: .3rem;
    }
  }
}

</style>
