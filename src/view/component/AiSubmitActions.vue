<template>
  <div :class="b()">
    <hui-button :class="b('action')" @click.native="$emit('cancel')">
      {{ cancelLabel }}
    </hui-button>
    <hui-button
      :class="b('action')"
      @click.native="$emit('submit')"
      type="primary"
    >
      {{ submitLabel }}
    </hui-button>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";

@Component({
  name: "ai-submit-actions",
})
export default class Home extends Vue {
  @Prop({ type: String, default: "取消" }) cancelLabel: string;
  @Prop({ type: String, default: "确认" }) submitLabel: string;
}
</script>

<style lang="scss" scoped>
.ai-submit-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;

  &__action {
    width: 100%;

    margin: 10px;
    min-height: 48px;
  }
}
</style>
