<template>
  <div class="filter-item">
    <!-- <image
      class="avatar"
      src=""
    /> -->
    <div class="avatar"></div>
    <div class="detail">
      <div class="tit">
        40分钟前 九阴白骨爪 <span>-1</span>
      </div>
      <div class="info">
        <div class="info-item">
          <span class="iconfont iconrenshu"></span> 周芷若
        </div>
        <div class="info-item">
          <span class="iconfont iconlaoshi"></span> 灭绝师太
        </div>
      </div>
      <div class="info">
        <div class="info-item">
          <span class="iconfont iconkecheng"></span> 九阴白骨爪（90/79天后过期）
        </div>
      </div>
    </div>
    <div class="arrow">
      <span class="iconfont iconjiantou"></span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.filter-item {
  position: relative;
  padding: 1rem 2.6rem .8rem 5.6rem;
  border-bottom: .1rem solid rgba(151, 151, 151, .1);

  .avatar {
    position: absolute;
    top: 1rem;
    left: 0;
    width: 4.5rem;
    height: 4.5rem;
    border-radius: 1rem;
    background-color: #ffd811;
  }

  .detail {
    .tit {
      color: #4a4a4a;
      font-size: 1.4rem;
      font-weight: bold;

      span {
        color: #8b572a;
        font-weight: bold;
      }
    }

    .info {
      display: flex;

      .info-item {
        flex: 1;
        color: #4a4a4a;
        font-size: 1.3rem;
        letter-spacing: .1rem;

        .iconfont {
          color: rgba(196, 90, 29, .6);
          font-size: 1.5rem;
        }
      }
    }
  }

  .arrow {
    position: absolute;
    top: 1rem;
    right: .9rem;

    .iconfont {
      color: #d4d4d4;
      font-size: 1.3rem;
    }
  }
}

</style>
