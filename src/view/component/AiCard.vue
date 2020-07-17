<template>
  <div :class="b()">
    <div :class="b('header')">
      <slot name="header">
        <img :src="cover" />
      </slot>
    </div>
    <div :class="b('body')">
      <slot name="body">
        {{ content }}
      </slot>
    </div>
    <div :class="b('footer')">
      <slot name="footer" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component({
  name: "ai-card",
})
export default class Home extends Vue {
  @Prop({ type: String, default: null }) cover: string;
  @Prop({ type: String, default: null }) content: string;
}
</script>
<style lang="scss" scoped>
.ai-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  width: 100%;
  height: 100%;
  min-height: 50px;

  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 3px 14px 0px rgba(0, 0, 0, 0.04);
  border-radius: 8px;
  overflow: hidden;

  &__header {
    width: 100%;
    max-height: 80%;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;

    img {
      max-width: 100%;
    }
  }
  &__body {
    width: 100%;
    padding: 10px 0px;
  }
}
</style>
