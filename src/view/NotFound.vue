<template>
  <div class="wrapper">
    <h1>404</h1>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class Home extends Vue {}
</script>
<style lang="scss" scoped>
.wrapper {
  h1 {
    width: 100%;
    margin-top: 30vh;
  }
}
</style>
