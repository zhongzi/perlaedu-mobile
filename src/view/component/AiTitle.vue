<template>
  <div :class="b()">
    <div :class="b('title')">
      {{ title }}
    </div>
    <slot>
      <div :class="b('subtitle')">
        {{ subtitle }}
      </div>
    </slot>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component({
  name: "ai-title",
})
export default class Home extends Vue {
  @Prop({ type: String, default: "" }) title: string;
  @Prop({ type: String, default: "" }) subtitle: string;
}
</script>
<style lang="scss" scoped>
.ai-title {
  display: flex;
  flex-direction: column;

  &__title {
    font-size: 16px;
    font-weight: 700;
    color: rgba(74, 74, 74, 1);
    line-height: 20px;
  }

  &__subtitle {
    font-size: 13px;
    font-weight: 400;
    color: rgba(155, 155, 155, 1);
    line-height: 18px;
  }
}
</style>
