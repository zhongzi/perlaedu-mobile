<template>
  <section class="container">
    <div class="kcssz">
      <div class="bd">
        <div class="lock-items">
          <arrow-item
            label="内部教学课程"
            type="radio"
            className="active"
          ></arrow-item>
          <arrow-item
            label="分享锁"
            type="radio"
          ></arrow-item>
          <arrow-item
            label="付费锁"
            value="付费金额 "
            type="radio"
          ></arrow-item>
        </div>

        <div class="tips">
          <div class="txt">*满足任意解锁条件即可解锁课程</div>
          <div class="txt">*付费锁手续费千分之6，T+1到账校长微信</div>
        </div>
      </div>

      <button-group :buttons="buttons"></button-group>
    </div>
  </section>
</template>

<script>
import ArrowItem from "~/components/ArrowItem.vue";
import ButtonGroup from "~/components/ButtonGroup.vue";

export default {
  components: {
    "arrow-item": ArrowItem,
    "button-group": ButtonGroup
  },
  head() {
    return {};
  },
  data() {
    return {
      buttons: [
        {
          text: "取消",
          type: "cancel",
          width: "126"
        },
        {
          text: "确认",
          type: "primary",
          width: "160"
        }
      ]
    };
  }
};
</script>
<style lang="scss">
</style>
