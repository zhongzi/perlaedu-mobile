<template>
  <section class="container">
    <div class="sjf">
      <div class="list">
        <div class="item">
          <user-item></user-item>
        </div>
        <div class="item">
          <user-item></user-item>
        </div>
        <div class="item">
          <user-item></user-item>
        </div>
        <div class="item">
          <user-item></user-item>
        </div>
        <div class="item">
          <user-item></user-item>
        </div>
        <div class="item">
          <user-item></user-item>
        </div>
        <div class="item">
          <user-item></user-item>
        </div>
        <div class="item">
          <user-item></user-item>
        </div>
        <div class="item">
          <user-item></user-item>
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
import UserItem from "~/components/UserItem2.vue";
import ButtonGroup from "~/components/ButtonGroup.vue";

export default {
  components: {
    /** 用户 */
    "user-item": UserItem,
    "button-group": ButtonGroup
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
          text: "确定",
          type: "primary",
          width: "160"
        }
      ]
    };
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
