<template>
  <div class="user-item">
    <div class="detail">
      <div class="avatar"></div>
      <div class="info">
        <div class="name">
          全真弃子 <span class="iconfont iconbangding"></span>
        </div>
        <div class="status">
          <span class="iconfont icontingke"></span> 已停课
        </div>
      </div>
    </div>
    <check-box
      size="big"
      v-if="type === 'type-2'"
    ></check-box>
    <div
      class="arrow"
      v-else
    ><span class="iconfont iconjiantou"></span></div>
  </div>
</template>
<script>
import CheckBox from "~/components/CheckBox.vue";

export default {
  props: ["type"],
  components: {
    /** 选择框 */
    "check-box": CheckBox
  }
};
</script>
<style lang="scss" scoped>
.user-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 7.8rem;
  border-top: .1rem solid rgba(151, 151, 151, .15);

  .detail {
    display: flex;
    flex: 1;
    align-items: center;

    .avatar {
      display: block;
      flex: 0 0 4.5rem;
      height: 4.5rem;
      border-radius: 1rem;
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

        .iconfont {
          margin-left: .4rem;
          color: #f58723;
          font-size: 1.3rem;
        }
      }

      .status {
        display: flex;
        align-items: center;
        height: 2rem;
        color: #4a4a4a;
        font-size: 1.2rem;

        .iconfont {
          position: relative;
          bottom: -.1rem;
          margin-right: .6rem;
          font-size: 1.4rem;
        }
      }
    }
  }

  .arrow {
    position: relative;
    top: -.9rem;
    color: #d4d4d4;
    .iconfont {
      font-size: 1.3rem;
    }
  }
}

</style>
