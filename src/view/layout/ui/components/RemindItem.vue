<template>
  <div class="remind-item">
    <div class="info">
      <div class="name">
        <div :class="'tag style-' + status">待确认</div> 全真弃子
      </div>
      <div class="status">
        <div class="item">
          <span class="iconfont iconlaoshi"></span>
          <div class="txt">灭绝师太</div>
          <span class="iconfont iconkecheng"></span>
          <div class="txt">周三 17:34 周三 17:34</div>
        </div>
      </div>
    </div>
    <check-box size="big"></check-box>
  </div>
</template>
<script>
import CheckBox from "~/components/CheckBox.vue";

export default {
  props: ["type", "status"],
  components: {
    /** 选择框 */
    "check-box": CheckBox
  }
};
</script>
<style lang="scss" scoped>
.remind-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 7rem;

  .info {
    flex: 1;

    .name {
      display: flex;
      align-items: center;
      color: #4a4a4a;
      font-size: 1.4rem;
      font-weight: bold;

      .tag {
        flex: 0 0 5rem;
        margin-right: .8rem;
        border-radius: .5rem;
        font-size: 1.2rem;
        line-height: 2.2rem;
        text-align: center;

        &.style-1 {
          background-color: #ffe9da;
          color: #f5802e;
        }

        &.style-2 {
          background-color: #e6e6e6;
          color: #9b9b9b;
        }
      }
    }

    .status {
      display: flex;
      align-items: center;
      padding-top: .4rem;
      color: #a5a5a5;
      font-size: 1.3rem;

      .item {
        display: flex;
        align-items: center;
        padding: 0 .1rem;

        .iconfont {
          margin-right: .4rem;
          font-size: 1.4rem;
        }

        .txt {
          margin-right: .4rem;
          white-space: nowrap;
        }
      }
    }
  }
}

</style>
