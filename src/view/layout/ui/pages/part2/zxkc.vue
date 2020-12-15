<template>
  <section class="container ai-background">
    <div class="zxkc">
      <div class="hd">
        <class-picker
          text="新东方烹饪学校"
          size="big"
        ></class-picker>
      </div>

      <div class="class-list">
        <div class="class-item active">
          <div class="circle"></div>在线课程
        </div>
        <div class="class-item">我的课程</div>
        <div class="class-item">内部课程</div>
      </div>

      <div class="bd ai-content">
        <div class="filter-area">
          <div class="filter-item">
            <div class="txt">显示 ＋</div>
            <div class="arrow">
              <span class="iconfont iconxiala"></span>
            </div>
          </div>
          <div class="filter-item">
            <div class="txt">武当一班</div>
            <div class="arrow">
              <span class="iconfont iconxiala"></span>
            </div>
          </div>
          <div class="filter-item">
            <div class="txt">周芷若</div>
            <div class="arrow">
              <span class="iconfont iconxiala"></span>
            </div>
          </div>
        </div>

        <div class="course-list">
          <div class="course-item">
            <course-item></course-item>
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
