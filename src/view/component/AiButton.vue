<template>
  <hui-button :class="b()" :type="type">
    <slot />
  </hui-button>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component({
  name: "ai-button",
})
export default class Home extends Vue {
  @Prop({ type: String, default: "info" }) type: string;
}
</script>
<style lang="scss" scoped>
.ai-button {
}
</style>
