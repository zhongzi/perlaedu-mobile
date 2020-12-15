<template>
  <section class="container ai-background">
    <div class="zxkczjmx">
      <div class="hd">
        <div class="class-picker">
          <class-picker
            text="新东方烹饪学校"
            size="big"
          ></class-picker>
        </div>
        <!-- Str 数据区 -->
        <div class="count-area">
          <div class="count-item">
            <div class="count">
              <div class="sum sum-1">+345</div>
              <div class="sum sum-2">-282</div>
            </div>
            <div class="txt">
              本日
            </div>
          </div>

          <div class="count-item">
            <div class="count">
              <div class="sum sum-1">+345</div>
              <div class="sum sum-2">-282</div>
            </div>
            <div class="txt">
              本日
            </div>
          </div>

          <div class="count-item">
            <div class="count">
              <div class="sum sum-1">+345</div>
              <div class="sum sum-2">-282</div>
            </div>
            <div class="txt">
              本日
            </div>
          </div>
        </div>
        <!-- End 数据区 -->
      </div>

      <div class="bd ai-content">
        <div class="cash-list">
          <div class="cash-item">
            <div class="info">
              <div class="date">
                2019/03/01 15:50:23
              </div>
              <div class="text">
                周芷若 <span class="action">解锁</span> 金花婆婆的毒该如何解？
              </div>
            </div>
            <div class="sums">
              <div class="income">+ 100.00</div>
              <div class="surplus">余 200.00</div>
            </div>
          </div>

          <div class="cash-item">
            <div class="info">
              <div class="date">
                2019/03/01 15:50:23
              </div>
              <div class="text">
                周芷若 <span class="action">解锁</span> 金花婆婆的毒该如何解？
              </div>
            </div>
            <div class="sums">
              <div class="income">+ 100.00</div>
              <div class="surplus">余 200.00</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import ClassPicker from "~/components/ClassPicker.vue";
import CourseItem from "~/components/CourseItem.vue";

export default {
  components: {
    "class-picker": ClassPicker,
    "course-item": CourseItem
  },
  head() {
    return {
      title: "AI教务"
    };
  }
};
</script>
<style lang="scss">
</style>
