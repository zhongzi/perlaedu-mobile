<template>
  <div class="pay-item">
    <div class="pay-info">
      <div class="pic"></div>
      <div class="info">
        <div class="name">AI教务 第一综合体</div>
        <div class="other">
          <div class="task-num">
            <div class="tag">在读</div>
            <div class="txt">课时库存:2321</div>
          </div>
          <div class="trigger">
            介绍 <span class="iconfont iconjiantou"></span>
          </div>
        </div>
      </div>
    </div>

    <div class="pay-select-area">
      <div class="ai-row">
        <div class="ai-col flex-1">
          <div class="pay-select-item">
            <div class="circle"></div>
            <div class="txt">架子鼓课程</div>
          </div>
        </div>

        <div class="ai-col flex-1">
          <div class="pay-select-item active">
            <div class="circle"></div>
            <div class="txt">架子鼓课程</div>
          </div>
        </div>

        <div class="ai-col flex-1">
          <div class="pay-select-item disabled">
            <div class="circle"></div>
            <div class="txt">架子鼓课程</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  components: {}
};
</script>
<style lang="scss" scoped>
.pay-item {
  overflow: hidden;
  border-radius: 1rem;
  background-color: #f0f0f0;

  .pay-info {
    display: flex;
    align-items: center;
    padding: 1.1rem;
    background: url(~assets/images/pay_item_bg.png) 0 0 no-repeat;
    background-size: 100% 100%;

    .pic {
      flex: 0 0 5.4rem;
      height: 5.4rem;
      margin-right: .7rem;
      border-radius: .8rem;
      background-color: #ffffff;
    }

    .info {
      flex: 1;

      .name {
        color: #ffffff;
        font-size: 1.6rem;
        font-weight: bold;
      }

      .other {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: .5rem 0 .2rem;

        .task-num {
          display: flex;
          flex: 4;
          align-items: center;

          .tag {
            flex: 0 0 3.3rem;
            margin-right: 1rem;
            opacity: .84;
            border-radius: .6rem;
            background: linear-gradient(
            132deg,
            rgba(255, 255, 255, 1) 0%,
            rgba(255, 255, 255, .55) 100%,
            rgba(255, 255, 255, .55) 100%
            );
            box-shadow: 0 .3rem .4rem 0 rgba(255, 153, 19, .52);
            color: rgba(255, 122, 6, .8);
            font-size: 1rem;
            line-height: 2;
            text-align: center;
          }

          .txt {
            color: rgba(255, 255, 255, .8);
            font-size: 1.2rem;
          }
        }

        .trigger {
          flex: 1;
          color: #ffffff;
          font-size: 1.2rem;
          text-align: right;

          .iconfont {
            font-size: 1.2rem;
          }
        }
      }
    }
  }

  .pay-select-area {
    .ai-row {
      padding: .3rem;
      .ai-col {
        padding: .3rem;
      }
    }

    .pay-select-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 3rem;
      padding: 0 1.6rem 0 1rem;
      border-radius: .6rem;
      background-color: #ffffff;
      color: #4a4a4a;
      font-size: 1.2rem;

      .circle {
        flex: 0 0 1.2rem;
        height: 1.2rem;
        border: .2rem solid #9b9b9b;
        border-radius: 50%;
      }

      &.disabled {
        opacity: .6;
      }

      &.active {
        .circle {
          position: relative;
          border: .2rem solid #f78438;

          &::after {
            position: absolute;
            top: .1rem;
            left: .1rem;
            width: .6rem;
            height: .6rem;
            border-radius: 50%;
            background-color: #f58235;
            content: '';
          }
        }
      }
    }
  }
}

</style>
