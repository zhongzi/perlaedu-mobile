<template>
  <section class="container">
    <div class="dianming">
      <div class="hd">
        <div class="class-info">
          <div class="tit">武当一班</div>
          <div class="txt">武当真武七截阵</div>
        </div>

        <counter value="1"></counter>
      </div>

      <div class="student-list">
        <cube-scroll>
          <div class="student-item">
            <dm-item></dm-item>
          </div>
          <div class="student-item">
            <dm-item></dm-item>
          </div>
          <div class="student-item">
            <dm-item></dm-item>
          </div>
          <div class="student-item">
            <dm-item></dm-item>
          </div>
          <div class="student-item">
            <dm-item></dm-item>
          </div>
          <div class="student-item">
            <dm-item></dm-item>
          </div>
          <div class="student-item">
            <dm-item></dm-item>
          </div>
        </cube-scroll>
      </div>

      <div class="btn-area">
        <div class="btn">
          <span class="number">已选（7）</span> 确定点名
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import DMItem from "~/components/DMItem.vue";
import Counter from "~/components/Counter.vue";

export default {
  components: {
    /** 表单数据 */
    "dm-item": DMItem,
    /** 计数器 */
    counter: Counter
  },

  data() {
    return {
      list: [
        {
          tag: "A",
          users: [
            {
              name: "全真弃子",
              binded: true,
              status: "已停课"
            }
          ]
        }
      ]
    };
  },

  head() {
    return {
      title: "点名"
    };
  }
};
</script>
<style lang="scss">
</style>
