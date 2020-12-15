<template>
  <section class="container">
    <div class="zfkc">
      <div class="bd">
        <div class="item">
          <pay-item></pay-item>
        </div>
      </div>
      <button-group :buttons="buttons">
      </button-group>
      <div class="btn-tips">已选择课程（1/4）</div>
    </div>
  </section>
</template>

<script>
import PayItem from "~/components/PayItem";
import ButtonGroup from "~/components/ButtonGroup.vue";

export default {
  components: {
    "pay-item": PayItem,
    "button-group": ButtonGroup
  },
  head() {
    return {
      title: "AI教务"
    };
  },
  data() {
    return {
      buttons: [
        {
          text: "立即支付",
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
