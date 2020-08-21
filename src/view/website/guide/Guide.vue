<template>
  <div class="wrapper guide">
    <div class="decorator">
      <div class="left"></div>
      <div class="right-top"></div>
      <div class="right"></div>
    </div>
    <div class="content">
      <join-and-share />
      <contact />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

import JoinAndShare from "./component/JoinAndShare.vue";
import Contact from "./component/Contact.vue";

@Component({
  components: {
    JoinAndShare,
    Contact,
  },
})
export default class Home extends Vue {}
</script>
<style lang="scss" scoped>
.guide {
  background: linear-gradient(
    133deg,
    rgba(255, 109, 47, 1) 0%,
    rgba(255, 100, 82, 1) 100%
  );
  box-shadow: 0px 8px 14px 0px rgba(0, 0, 0, 0.06);
  padding: 40px 30px;

  position: relative;
  .content {
    position: relative;
    z-index: 20;
  }
  .decorator {
    position: absolute;
    top: 0px;
    left: 0px;
    right: 0px;
    height: 50vh;
    overflow-x: hidden;

    .left {
      position: absolute;
      left: -80px;
      top: -100px;

      width: 225px;
      height: 242px;
      background: linear-gradient(
        151deg,
        rgba(255, 185, 100, 1) 0%,
        rgba(255, 131, 6, 0) 100%
      );
      box-shadow: 0px 8px 14px 0px rgba(0, 0, 0, 0.06);
      border-radius: 50%;
    }

    .right-top {
      position: absolute;
      right: 0px;
      top: -10px;

      width: 50px;
      height: 50px;
      background: linear-gradient(
        151deg,
        rgba(255, 185, 100, 1) 0%,
        rgba(255, 131, 6, 0) 100%
      );
      box-shadow: 0px 8px 14px 0px rgba(0, 0, 0, 0.06);
      border-radius: 50%;
    }

    .right {
      position: absolute;
      right: -100px;
      top: 80px;

      width: 225px;
      height: 242px;
      background: linear-gradient(
        151deg,
        rgba(255, 185, 100, 1) 0%,
        rgba(255, 131, 6, 0) 100%
      );
      box-shadow: 0px 8px 14px 0px rgba(0, 0, 0, 0.06);
      opacity: 0.74;
      border-radius: 50%;
    }
  }
}
</style>
