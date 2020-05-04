<template>
  <hui-button class="ai-button-plus">
    <i class="iconfont icon-plus" />
  </hui-button>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class Home extends Vue {}
</script>
<style lang="scss" scoped>
.ai-button-plus {
  width: 100%;
  height: 100%;
  min-height: 60px;
  border-radius: 8px;
}
</style>
