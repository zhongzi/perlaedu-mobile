<template>
  <div class="roll-call-item">
    <div class="name">
      <div class="text">武当一班 真武七截阵 <span>-1</span></div>
      <div class="arrow-rigth">
        <span class="iconfont iconjiantou"></span>
      </div>
    </div>
    <div class="info">
      <div class="info-item">
        <span class="iconfont iconkecheng"></span> 真武七级镇 周日 13:05
      </div>
      <div class="info-item">
        <span class="iconfont iconlaoshi"></span> 灭绝师太
      </div>
    </div>
    <div class="stu-list">
      <div class="stu-item">
        <student-item status="bind"></student-item>
      </div>
      <div class="stu-item">
        <student-item status="que"></student-item>
      </div>
      <div class="stu-item">
        <student-item status="bing"></student-item>
      </div>
      <div class="stu-item">
        <student-item status="chi"></student-item>
      </div>
      <div class="stu-item">
        <student-item status="jia"></student-item>
      </div>
      <div class="stu-item">
        <div class="more hide">
          <span class="iconfont iconjiantou"></span> 收起名单
        </div>
      </div>
      <div class="stu-item">
        <div class="more show">
          <span class="iconfont iconjiantou"></span> 展开名单
        </div>
      </div>
    </div>

    <div class="status">
      <div class="count">已到7人<span>/未到23人</span></div>
      <div class="status-count">
        <div>
          <div class="ico jia"></div>14
        </div>
        <div>
          <div class="ico chi"></div>14
        </div>
        <div>
          <div class="ico bing"></div>8
        </div>
        <div>
          <div class="ico que"></div>1
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import CheckBox from "~/components/CheckBox.vue";
import StudentItem2 from "~/components/StudentItem2.vue";
export default {
  props: [],
  components: {
    "check-box": CheckBox,
    "student-item": StudentItem2
  },
  head() {
    return {
      title: "AI教务"
    };
  }
};
</script>
<style lang="scss" scoped>
.roll-call-item {
  padding: 2rem 0 1rem;
  border-bottom: .1rem solid rgba(151, 151, 151, .1);

  .name {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #4a4a4a;
    font-size: 1.4rem;
    font-weight: bold;

    span {
      color: #8b572a;
    }

    .arrow-rigth {
      .iconfont {
        color: #4a4a4a;
        font-size: 1.3rem;
      }
    }
  }

  .info {
    overflow: hidden;

    .info-item {
      display: flex;
      float: left;
      align-items: center;
      margin-right: 2.4rem;
      color: #afafaf;
      font-size: 1.3rem;

      .iconfont {
        margin-right: .5rem;
        color: #4a4a4a;
      }
    }
  }

  .stu-list {
    display: flex;
    justify-content: space-between;
    padding: 1rem .2rem .8rem;

    flex-wrap: wrap;

    .stu-item {
      margin-bottom: 1rem;

      .more {
        display: flex;
        justify-content: space-between;
        align-items: center;
        box-sizing: border-box;
        width: 10rem;
        height: 3.4rem;
        padding: 0 1.4rem;
        border-radius: 1rem;
        background-color: #f1f0ee;
        color: #5e5e5e;
        font-size: 1.2rem;

        .iconfont {
          font-size: 1.2rem;
        }

        &.show {
          .iconfont {
            transform: rotate(90deg);
          }
        }

        &.hide {
          .iconfont {
            transform: rotate(-90deg);
          }
        }
      }
    }
  }

  .status {
    display: flex;
    justify-content: space-between;

    .count {
      color: #545454;
      font-size: 1.3rem;

      & > span {
        color: #a5a5a5;
      }
    }

    .status-count {
      overflow: hidden;

      & > div {
        display: flex;
        float: right;
        align-items: center;
        margin-left: 1rem;
        color: #4a4a4a;
        font-size: 1.3rem;
      }

      .ico {
        width: 1.8rem;
        height: 1.8rem;
        margin-right: .4rem;

        &.que {
          background: url(~assets/images/icon_que_2.png) 50% 50% no-repeat;
          background-size: 100% 100%;
        }

        &.bing {
          background: url(~assets/images/icon_bing_2.png) 50% 50% no-repeat;
          background-size: 100% 100%;
        }

        &.jia {
          background: url(~assets/images/icon_jia_2.png) 50% 50% no-repeat;
          background-size: 100% 100%;
        }

        &.chi {
          background: url(~assets/images/icon_chi_2.png) 50% 50% no-repeat;
          background-size: 100% 100%;
        }
      }
    }
  }
}

</style>
