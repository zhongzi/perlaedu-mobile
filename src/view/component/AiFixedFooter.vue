<template>
  <div :class="b()">
    <div :class="b('body')">
      <slot name="body">
        <div class="b('body-default')">
          <slot></slot>
        </div>
      </slot>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({
  name: "ai-fixed-footer",
})
export default class Home extends Vue {}
</script>

<style scoped lang="scss">
.ai-fixed-footer {
  min-height: 52px;
  z-index: 20131227;

  &__body {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 52px;
    background-color: #fafafa;

    &-default {
      height: 100%;
    }
  }
}
</style>
