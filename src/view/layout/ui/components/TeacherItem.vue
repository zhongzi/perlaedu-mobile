<template>
  <div class="teacher-item">
    <div class="avatar">
      <div class="ico">
        <span class="iconfont iconbangding"></span>
      </div>
    </div>

    <div class="name-area">
      <div :class="item.active ? 'name active' : 'name'">{{item.name}}</div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["item"]
};
</script>

<style lang="scss" scoped>
.teacher-item {
  position: relative;
  box-sizing: border-box;
  width: 16.6rem;
  height: 5.4rem;
  padding: .2rem;
  border-radius: 1rem;

  .avatar {
    position: absolute;
    top: 0;
    left: 0;
    width: 5.4rem;
    height: 5.4rem;
    border-radius: 1rem;
    background-color: #ffd811;

    .ico {
      position: absolute;
      right: -.5rem;
      bottom: 0;
      width: 1.9rem;
      border-radius: .4rem;
      background-color: rgba(255, 255, 255, .9);
      line-height: 1.9rem;
      text-align: center;

      .iconfont {
        color: #f58723;
        font-size: .9rem;
      }
    }
  }

  .name-area {
    height: 100%;
    border-radius: 1rem;

    .name {
      display: flex;
      align-items: center;
      box-sizing: border-box;
      height: 100%;
      padding-left: 7rem;
      border: .2rem solid #f2f2f2;
      border-radius: 1rem;
      background-color: #f2f2f2;
      color: #4a4a4a;
      font-size: 1.5rem;

      &.active {
        border: .2rem solid #ffffff;
        background: linear-gradient(
        124deg,
        rgba(255, 146, 73, .9) 0%,
        rgba(226, 99, 14, .9) 100%
        );
        background-color: none;
        color: #ffffff;
        font-size: 1.6rem;
        font-weight: bold;
      }
    }
  }
}

</style>
