<template>
  <div :class="b()">
    <div :class="b('1')" />
    <div :class="b('2')" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({
  name: "ai-double-bounce",
})
export default class Home extends Vue {}
</script>
<style lang="scss" scoped>
.ai-double-bounce {
  position: relative;

  &__1,
  &__2 {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: #333;
    opacity: 0.6;
    position: absolute;
    top: 0;
    left: 0;
    animation: ai-double-bounce_animation 2s infinite ease-in-out;
  }

  &__2 {
    animation-delay: -1s;
  }
}

@keyframes ai-double-bounce_animation {
  0%,
  100% {
    transform: scale(0);
  }

  50% {
    transform: scale(1);
  }
}
</style>
