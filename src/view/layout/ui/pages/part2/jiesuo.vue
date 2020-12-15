<template>
  <section class="container">
    <div class="jiesuo">
      <div class="ai-mask">
        <div class="content center">
          <div class="icon icon-left"></div>
          <div class="icon icon-right"></div>
          <div class="title">解锁课程</div>
          <div class="part">
            <div class="part-title">
              分享给3人浏览解锁
            </div>
            <div class="tips">浏览人数达到3人后，即可解锁该课程</div>

            <div class="user-list">
              <div class="pics">
                <div class="pic-item"></div>
                <div class="pic-item"></div>
              </div>
              <div class="txt">已有2人浏览</div>
            </div>
          </div>

          <div class="part">
            <div class="part-title">
              分享给2人转发解锁
            </div>
            <div class="tips">成功支付¥1.00元后，即可解锁该课程</div>
          </div>

          <div class="part">
            <div class="part-title style-1">
              付费 ¥1.00元解锁
            </div>
            <div class="tips">成功支付¥1.00元后，即可解锁该课程</div>
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
