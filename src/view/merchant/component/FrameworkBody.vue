<template>
  <div class="wrapper framework-body">
    <slot />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class Home extends Vue {}
</script>
<style lang="scss" scoped>
.framework-body {
  position: relative;
  top: -15px;

  background: #f6f6f6;
  border-radius: 20px 20px 0px 0px;
  min-height: 50vh;

  padding-top: 10px;
}
</style>
