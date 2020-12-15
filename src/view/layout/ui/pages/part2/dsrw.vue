<template>
  <section class="container ai-background">
    <div class="dsrw">
      <div class="hd">
        <div class="btn">新建定时任务</div>
      </div>

      <div class="bd ai-content">
        <div class="task-area">
          <div class="task-item">
            <div class="tit">12:30 记得扣课时 </div>
            <div class="txt">「所有老师」 周一、周四、周五 千万记得</div>
            <div class="radio-btn"> </div>
          </div>

          <div class="task-item">
            <div class="tit">12:30 记得扣课时 </div>
            <div class="txt">「所有老师」 周一、周四、周五 千万记得</div>
            <div class="radio-btn"> </div>
          </div>

          <div class="task-item">
            <div class="tit">12:30 记得扣课时 </div>
            <div class="txt">「所有老师」 周一、周四、周五 千万记得</div>
            <div class="radio-btn active"> </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import Logo from "~/components/Logo.vue";

export default {
  components: {
    Logo
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
