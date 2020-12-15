<template>
  <div :class="active ? 'item active' : 'item'">
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
        v-if="status === 'bind'"
      >
        <span class="iconfont iconbangding"></span>
      </div>
    </div>

    <div class="name">张翠山</div>

    <div class="trigger"><span class="iconfont iconxueshengshanchu"></span></div>
  </div>
</template>
<script>
export default {
  props: ["status", "active"]
};
</script>
<style lang="scss" scoped>
.item {
  position: relative;
  box-sizing: border-box;
  width: 11.4rem;
  height: 3.6rem;
  padding: .1rem 3rem .1rem 4.5rem;
  border-radius: 1rem;
  background-color: #f2f2f2;

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
      right: -.1rem;
      bottom: 0;
      width: 1.6rem;
      height: 1.6rem;
      border-radius: .4rem;
      background-color: #ffffff;
      text-align: center;
      .iconfont {
        color: #f58723;
        font-size: .8rem;
      }
    }
  }

  .trigger {
    position: absolute;
    top: 48%;
    right: 0;
    width: 3rem;
    line-height: 3rem;
    transform: translateY(-50%);
    text-align: center;

    .iconfont {
      font-size: .9rem;
    }
  }

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

    .trigger {
      color: #ffffff;
    }
  }
}

</style>
