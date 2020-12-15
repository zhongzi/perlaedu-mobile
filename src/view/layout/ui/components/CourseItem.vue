<template>
  <div class="dm-item">
    <div class="detail">
      <div class="pic"></div>
      <div class="info">
        <div class="name">
          宋远桥
        </div>
        <div class="sums">
          <div class="sum-item">浏览:3239</div>
          <div class="sum-item">转发:121</div>
          <div class="sum-item">解锁:61</div>
        </div>
        <div class="others">
          <div class="class-info">
            <div class="status">已上架</div>
            <div class="txt">单个视频</div>
          </div>

          <div class="type jiesuo"></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import CheckBox from "~/components/CheckBox.vue";
export default {
  props: [],
  components: {
    "check-box": CheckBox
  },
  head() {
    return {
      title: "AI教务"
    };
  }
};
</script>
<style lang="scss" scoped>
.dm-item {
  padding: 1rem 0;
  border-bottom: .1rem solid rgba(216, 216, 216, .3);

  .detail {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .pic {
      display: block;
      flex: 0 0 11.2rem;
      height: 7.6rem;
      border-radius: 1.2rem;
      background: linear-gradient(
      136deg,
      rgba(255, 207, 51, 1) 0%,
      rgba(255, 131, 6, 1) 100%
      );
    }

    .info {
      display: flex;
      flex-direction: column;
      flex: 1;
      justify-content: space-between;
      padding-left: 1rem;

      .name {
        display: flex;
        align-items: center;
        padding: .2rem 0;
        color: #545454;
        font-size: 1.4rem;
        font-weight: bold;
      }

      .sums {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-bottom: .8rem;
        color: rgba(74, 74, 74, .6);
        font-size: 1.2rem;
      }

      .others {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .class-info {
          display: flex;
          align-items: center;
          color: #4a4a4a;

          .status {
            margin-right: .8rem;
            padding: 0 .7rem;
            border-radius: .5rem;
            background: rgba(254, 122, 33, .2);
            color: #f5802e;
            font-size: 1.2rem;
            line-height: 2.2rem;
          }
        }

        .type {
          width: 2.6rem;
          height: 1.3rem;
          &.jiesuo {
            background: url('~assets/images/icon_jiesuo.png') 0 0 / 100% 100%
            no-repeat;
          }

          &.mianfei {
            background: url('~assets/images/icon_mianfei.png') 0 0 / 100% 100%
            no-repeat;
          }
        }
      }
    }
  }
}

</style>
