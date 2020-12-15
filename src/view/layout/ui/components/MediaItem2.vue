<template>
  <div :class="'item ' + (type || '')">
    <div class="label">
      {{label}}
      <span
        class="star"
        v-if="required"
      >*</span>
    </div>
    <div class="cont">
      <div
        class="image"
        v-if="type === 'image'"
      >
        <div class="icon">
          <span class="iconfont iconzhaopian"></span>
        </div>
      </div>

      <div
        class="video"
        v-if="type === 'video'"
      >
        <div class="icon"></div>
      </div>

      <div
        class="voice"
        v-if="type === 'voice'"
      >
        <span class="iconfont iconyuyinshuru"></span>
        <div class="txt">按住语音输入</div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: ["type", "label", "required"],
  head() {
    return {
      title: "AI教务"
    };
  }
};
</script>
<style lang="scss" scoped>
.item {
  position: relative;
  padding: 1.2rem 0 1rem;

  .label {
    padding: .1rem 0;
    color: #4a4a4a;
    font-size: 1.4rem;
    font-weight: bold;
  }

  .cont {
    padding: .7rem 0 .3rem;

    .input {
      width: 100%;
      color: #4a4a4a;
      font-size: 1.3rem;

      &::-webkit-input-placeholder {
        color: #9b9b9b;
      }
    }

    .voice {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 4.4rem;
      padding: 0 1.6rem;
      border-radius: .8rem;
      background-color: #fbfbfb;

      .iconfont {
        color: #4a4a4a;
        font-size: 2rem;
      }

      .txt {
        color: #4a4a4a;
        font-size: 1.4rem;
      }
    }

    .image {
      .icon {
        line-height: 7rem;
        text-align: center;

        .iconfont {
          color: #888888;
          font-size: 3rem;
        }
      }
    }

    .video {
      .icon {
        background: url(~assets/images/icon_video.png) 50% 50% no-repeat;
        background-color: #fbfbfb;
        background-size: 3.4rem 3rem;
      }
    }

    .icon {
      width: 7rem;
      height: 7rem;
      border-radius: .8rem;
      background-color: #fbfbfb;
    }
  }

  &.voice {
    padding: 0;
    .cont {
      width: 100%;
      height: 4.4rem;
    }
  }
}

</style>
