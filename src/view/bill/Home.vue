<template>
  <div class="wrapper">
    <router-view />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class Home extends Vue {}
</script>
<style lang="scss" scoped>
.wrapper {
}
</style>
