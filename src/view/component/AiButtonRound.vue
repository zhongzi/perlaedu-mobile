<template>
  <hui-button :class="b()">
    <slot />
  </hui-button>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({
  name: "ai-button-round",
})
export default class Home extends Vue {}
</script>
<style lang="scss" scoped>
.ai-button-round {
  width: 100%;
  height: 100%;
  min-height: 50px;
  border-radius: 8px;
}
</style>
