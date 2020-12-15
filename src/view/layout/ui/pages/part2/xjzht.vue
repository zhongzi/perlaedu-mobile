<template>
  <section class="container">
    <div class="xjzht">
      <div class="bd">
        <div class="part-info">
          <div class="pic"></div>
          <div class="info">
            <div class="name">
              <div class="txt">AI教务 第一综合体</div>
              <div class="arrow">
                <span class="iconfont iconjiantou"></span>
              </div>
            </div>
            <div class="other">
              <div class="tag">火热招商</div>
            </div>
          </div>
        </div>
      </div>
      <button-group :buttons="buttons"></button-group>
    </div>
  </section>
</template>

<script>
import ButtonGroup from "~/components/ButtonGroup.vue";

export default {
  components: {
    "button-group": ButtonGroup
  },
  head() {
    return {
      title: "新建综合体"
    };
  },
  data() {
    return {
      buttons: [
        {
          text: "新建综合体",
          type: "primary",
          width: "306"
        }
      ]
    };
  }
};
</script>
<style lang="scss">
</style>
