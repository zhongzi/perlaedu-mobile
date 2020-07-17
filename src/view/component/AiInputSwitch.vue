<template>
  <div :class="b()">
    <div :class="b('label')" v-if="label">
      <slot>
        {{ label }}
      </slot>
    </div>
    <toggle-button
      :value="value"
      :sync="true"
      @input="(v) => $emit('input', v)"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Mixins, Watch } from "vue-property-decorator";

import { ToggleButton } from "vue-js-toggle-button";

@Component({
  name: "ai-input-switch",
  components: {
    ToggleButton,
  },
})
export default class Home extends Vue {
  @Prop({ type: String, default: null }) label: string;
  @Prop({ type: Boolean, default: false }) value: boolean;
  @Prop({ type: Boolean, default: true }) showBottomLine: boolean;
}
</script>
<style lang="scss" scoped>
.ai-input-switch {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;

  &__label {
    font-size: 14px;
    font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
    font-weight: bold;
    color: rgba(84, 84, 84, 1);
    line-height: 19px;
    letter-spacing: 1px;
  }
}
</style>
