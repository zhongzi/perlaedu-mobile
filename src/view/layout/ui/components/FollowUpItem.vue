<template>
  <div class="follow-up">
    <div class="top">
      <div class="name">宋远桥 15387567777</div>
      <div class="time">
        2019/10/25 周五 >
      </div>
    </div>
    <div class="tags">
      <div class="tag">已沟通</div>
      <div class="tag">已沟通</div>
      <div class="tag">已沟通</div>
      <div class="tag">已沟通</div>
      <div class="tag">已沟通</div>
    </div>
    <div class="bot">
      <div class="time">
        <span class="iconfont icongenjinshijian"></span> 2019/10/25 10:00:00
      </div>
      <div class="name">
        <span class="iconfont icongenjinren"></span> 跟进人：宋青书
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
.follow-up {
  padding: .6rem 0 .8rem;
  border-bottom: .1rem solid rgba(151, 151, 151, .2);

  .top {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .name {
      color: #5e5e5e;
      font-size: 1.4rem;
      font-weight: bold;
    }

    .time {
      color: #9b9b9b;
      font-size: 1.3rem;
    }
  }

  .tags {
    display: flex;
    padding: .4rem 0 1.6rem;
    .tag {
      min-width: 3.6rem;
      margin: 0 .6rem 0 0;
      padding: 0 .4rem;
      border-radius: .5rem;
      background-color: #fa8e45;
      color: #ffffff;
      font-size: .9rem;
      line-height: 1.7rem;
      text-align: center;
    }
  }

  .bot {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #c45a1d;
    font-size: 1.3rem;

    .iconfont {
      margin-right: .6rem;
      font-size: 1.6rem;
    }

    .name,
    .time {
      display: flex;
      align-items: center;
    }
  }
}

</style>
