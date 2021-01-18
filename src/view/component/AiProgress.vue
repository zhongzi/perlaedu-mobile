<template>
  <hui-progress :class="b()" :percentage="percentage" />
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component
export default class Home extends Vue {
  @Prop({ type: Number, default: 0 }) percentage: number;
}
</script>
<style lang="scss" scoped></style>
