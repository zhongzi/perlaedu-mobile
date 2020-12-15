<template>
  <section class="container">
    <div class="dbsx">
      <div class="agency-item">
        <check-box
          :active="false"
          size="big"
        ></check-box>
        <div class="cont">
          <div class="txt overdue">确认 2019-12-23 周四的上课提醒</div>
          <div class="trigger">
            <div class="point"></div>
            <div class="point"></div>
            <div class="point"></div>
          </div>
        </div>
      </div>

      <div class="agency-item">
        <check-box
          :active="true"
          size="big"
        ></check-box>
        <div class="cont">
          <div class="txt">
            确认 2019-12-23 周四的上课提醒<br />（由 CIPHER@AI教务 推荐）
          </div>
          <div class="trigger">
            <div class="point"></div>
            <div class="point"></div>
            <div class="point"></div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import CheckBox from "~/components/CheckBox.vue";

export default {
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
<style lang="scss">
</style>
