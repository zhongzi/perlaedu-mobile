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
      <div :class="status + ' ico'"></div>
    </div>

    <div class="name">张翠山</div>
  </div>
</template>
<script>
export default {
  props: ["status"]
};
</script>
<style lang="scss" scoped>
.item {
  position: relative;
  box-sizing: border-box;
  width: 10rem;
  height: 3.6rem;
  padding: .1rem .1rem .1rem 4.5rem;
  border-radius: 1rem;
  background-color: #f2f2f2;

  .avatar {
    position: absolute;
    top: 0;
    left: 0;
    width: 3.6rem;
    height: 3.6rem;
    border-radius: 1rem;
    background-color: #f58723;

    .ico {
      position: absolute;
      right: -.1rem;
      bottom: 0;
      width: 1.6rem;
      height: 1.6rem;

      &.bind {
        border-radius: .4rem;
        background: url(~assets/images/icon_bind.png) 50% 50% no-repeat;
        background-color: #ffffff;
        background-size: 1.1rem .9rem;
      }

      &.que {
        background: url(~assets/images/icon_que_1.png) 50% 50% no-repeat;
        background-size: 100% 100%;
      }

      &.bing {
        background: url(~assets/images/icon_bing_1.png) 50% 50% no-repeat;
        background-size: 100% 100%;
      }

      &.jia {
        background: url(~assets/images/icon_jia_1.png) 50% 50% no-repeat;
        background-size: 100% 100%;
      }

      &.chi {
        background: url(~assets/images/icon_chi_1.png) 50% 50% no-repeat;
        background-size: 100% 100%;
      }
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
  }
}

</style>
