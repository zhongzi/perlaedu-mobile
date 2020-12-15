<template>
  <section class="container">
    <div class="qrtx">
      <div class="bd">
        <div class="remind-box">
          <div class="circle-line style-1">
            <div class="circle"></div>
            <div class="line"></div>
          </div>
          <remind-item :status="1"></remind-item>
        </div>
        <div class="remind-box">
          <div class="circle-line style-2">
            <div class="circle"></div>
            <div class="line"></div>
          </div>
          <remind-item :status="2"></remind-item>
        </div>
      </div>

      <button-group
        className="transparent"
        :buttons="buttons"
      ></button-group>
    </div>
  </section>
</template>

<script>
import RemindItem from "~/components/RemindItem";
import ButtonGroup from "~/components/ButtonGroup";

export default {
  components: {
    "remind-item": RemindItem,
    "button-group": ButtonGroup
  },
  head() {
    return {
      title: "确认提醒"
    };
  },
  data() {
    return {
      buttons: [
        {
          text: "临时取消",
          type: "cancel",
          width: "100"
        },
        {
          text: "更改时间",
          type: "cancel",
          width: "100"
        },
        {
          text: "确认提醒",
          type: "primary",
          width: "100"
        }
      ]
    };
  }
};
</script>
<style lang="scss">
</style>
