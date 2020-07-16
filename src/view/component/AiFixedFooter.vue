<template>
  <div :class="b()">
    <div :class="b('body')">
      <slot name="body">
        <div :class="b('body-default')">
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
  z-index: 199;
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  background-color: #fafafa;

  &__body {
    &-default {
      height: 100%;
      padding: 5px;
    }
  }
}
</style>
