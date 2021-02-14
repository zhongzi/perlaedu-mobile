<template>
  <div class="wrapper framework-header">
    <div class="switch-container">
      <switch-merchant class="switch" />
      <slot name="switch" />
    </div>
    <slot />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

import SwitchMerchant from "./SwitchMerchant.vue";

@Component({
  components: {
    SwitchMerchant,
  },
})
export default class Home extends Vue {}
</script>
<style lang="scss" scoped>
.framework-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  padding-top: 10px;
  padding-bottom: 30px;
  background: linear-gradient(119deg, #ff9249 0%, #e2630e 100%);

  .switch-container {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    .switch {
      max-width: 60%;
    }
  }
}
</style>
