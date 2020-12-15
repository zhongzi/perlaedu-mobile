<template>
  <div class="user-item">
    <div class="detail">
      <!-- <image
        class="avatar"
        src=""
      /> -->
      <div class="avatar"></div>
      <div class="info">
        <div class="name">
          全真弃子
        </div>
        <div class="status">
          积分79
        </div>
      </div>
    </div>
    <counter value="23"></counter>
  </div>
</template>
<script>
import Counter from "~/components/Counter.vue";
export default {
  components: {
    /** 计数器 */
    counter: Counter
  }
};
</script>
<style lang="scss" scoped>
.user-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 7.8rem;
  border-top: .1rem solid rgba(216, 216, 216, .2);

  .detail {
    display: flex;
    flex: 1;
    align-items: center;

    .avatar {
      display: block;
      flex: 0 0 4.5rem;
      height: 4.5rem;
      border-radius: .8rem;
      background-color: #ffd811;
    }

    .info {
      flex: 1;
      padding-left: 1rem;

      .name {
        display: flex;
        align-items: center;
        color: #4a4a4a;
        font-size: 1.4rem;
        font-weight: bold;

        .ico {
          flex: 0 0 1.5rem;
          height: 1.3rem;
          margin-left: .4rem;
          background: url(~assets/images/icon_bind.png) 0 0 no-repeat;
          background-size: 100% 100%;
        }
      }

      .status {
        display: flex;
        align-items: center;
        color: #4a4a4a;
        font-size: 1.2rem;

        .ico {
          flex: 0 0 1.6rem;
          height: 1.4rem;
          margin-right: .4rem;
          background: url(~assets/images/icon_status.png) 0 0 no-repeat;
          background-size: 100% 100%;
        }
      }
    }
  }

  .arrow {
    color: #d4d4d4;
    font-size: 2rem;
  }
}

</style>
