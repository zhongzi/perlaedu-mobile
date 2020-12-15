<template>
  <div class="item">
    <!-- <div class="avatar-area">
      <image
        class="avatar"
        src=""
      />
      <image
        class="ico"
        src=""
      />
    </div> -->

    <div class="avatar">
      <div
        class="ico"
        v-if="isBind"
      >
        <span class="iconfont iconbangding"></span>
      </div>
    </div>

    <div :class="active ? 'cont active' : 'cont'">
      <div class="name">张翠山</div>
    </div>
  </div>
</template>
<script>
export default {
  props: ["active", "isBind"]
};
</script>
<style lang="scss" scoped>
.item {
  position: relative;
  box-sizing: border-box;
  width: 10rem;
  height: 3.6rem;
  padding: .1rem .1rem .1rem 1.5rem;
  border-radius: 1rem;

  .avatar {
    position: absolute;
    top: 0;
    left: 0;
    width: 3.6rem;
    height: 3.6rem;
    border-radius: 1rem;
    background-color: #ffd811;

    .ico {
      position: absolute;
      right: -.2rem;
      bottom: 0;
      width: 1.2rem;
      height: 1.2rem;
      border-radius: .4rem;
      background-color: #ffffff;
      line-height: 1.2rem;
      text-align: center;

      .iconfont {
        color: #f58723;
        font-size: .7rem;
      }
    }
  }

  .cont {
    padding-left: 3rem;
    border-radius: 1rem;
    background-color: #f2f2f2;
    .name {
      color: #4a4a4a;
      font-size: 1.2rem;
      line-height: 3.4rem;
    }

    &.active {
      background-color: #fa8e45;
      .name {
        color: #ffffff;
      }
    }
  }
}

</style>
