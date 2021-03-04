<template>
  <ai-float-action
    v-show="enabled"
    @click="gotoBack"
    icon="direction-left"
    class="float-back"
  >
  </ai-float-action>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

import AiFloatAction from "./component/AiFloatAction.vue";

@Component({
  components: {
    AiFloatAction,
  },
})
export default class Home extends Vue {
  get enabled() {
    return (
      this.$route.meta.enableFloatBack ||
      (this.$client.device.isPC &&
        this.$client.pc.isWin &&
        this.$client.browser.isMicromessenger)
    );
  }

  gotoBack() {
    return this.$router.go(-1);
  }
}
</script>
<style lang="scss" scoped>
.float-back {
  right: auto;
  left: 20px;

  width: 40px !important;
  height: 40px !important;
  border-radius: 50%;
  overflow: hidden;
  box-shadow: 0 0.8rem 1.4rem 0 rgb(0 0 0 / 20%);

  & ::v-deep i {
    font-size: 20px;
  }
}
</style>
