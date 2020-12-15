<template>
  <div class="handle-area">
    <div class="handle-left">
      <div class="ico ">
        <span class="iconfont iconxiugai"></span>
      </div>
      <div class="ico">
        <span class="iconfont iconshanchu"></span>
      </div>
    </div>
    <slot></slot>
    <div class="handle-right">
      <div class="ico text"></div>
      <div class="ico image"></div>
    </div>
  </div>
</template>
<script>
export default {
  props: ["text", "active", "size"],
  head() {
    return {
      title: "AI教务"
    };
  }
};
</script>
<style lang="scss" scoped>
.handle-area {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: .6rem .9rem;
  background-color: #fdfdfd;
  color: #4a4a4a;
  font-size: 1.2rem;

  .handle-left,
  .handle-right {
    display: flex;
    justify-content: center;
    width: 8rem;
    height: 2.4rem;
    border-radius: 6px;
    background-color: #ededed;

    .ico {
      flex: 1;
      height: 100%;
      text-align: center;

      &:first-child {
        position: relative;

        &::after {
          position: absolute;
          top: 50%;
          left: 100%;
          width: .1rem;
          height: 1.2rem;
          background: rgba(191, 191, 191, .5);
          content: '';
          transform: translate(-50%, -50%);
        }
      }

      &.edit {
        background: url(~assets/images/icon_text.png) 50% 50% no-repeat;
        background-size: 1.6rem 1.3rem;
      }

      &.delete {
        background: url(~assets/images/icon_add_image.png) 50% 50% no-repeat;
        background-size: 1.6rem 1.4rem;
      }

      &.text {
        background: url(~assets/images/icon_text.png) 50% 50% no-repeat;
        background-size: 1.6rem 1.3rem;
      }

      &.image {
        background: url(~assets/images/icon_add_image.png) 50% 50% no-repeat;
        background-size: 1.6rem 1.4rem;
      }
    }
  }
}

</style>
