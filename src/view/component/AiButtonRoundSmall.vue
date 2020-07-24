<template>
  <div :class="b()">
    <i v-if="icon" :class="['iconfont', 'icon-' + icon]" />
    <span>
      <slot>
        {{ label }}
      </slot>
    </span>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component({
  name: "ai-button-round-small",
})
export default class Home extends Vue {
  @Prop({ type: String, default: "" }) label: string;
  @Prop({ type: String, default: null }) icon: string;
}
</script>
<style lang="scss" scoped>
.ai-button-round-small {
  display: flex;
  align-items: center;
  justify-content: center;

  background: linear-gradient(
    132deg,
    rgba(255, 255, 255, 1) 0%,
    rgba(255, 255, 255, 0.55) 100%,
    rgba(255, 255, 255, 0.55) 100%
  );
  box-shadow: 0px 3px 14px 0px rgba(0, 0, 0, 0.04),
    0px 3px 4px 0px rgba(255, 153, 19, 0.52);
  border-radius: 6px;
  opacity: 0.84;
  padding: 1px 5px;

  i {
    margin-right: 10px;
  }
  span {
    font-size: 13px;
    font-weight: 500;
    color: rgba(255, 158, 22, 1);
    line-height: 18px;
  }
}
</style>
