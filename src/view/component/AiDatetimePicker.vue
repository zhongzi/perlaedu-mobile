<template>
  <ai-dialog
    :value="show"
    @input="updateShow"
    :class="b()"
    :enableCloseIcon="false"
  >
    <ai-input-date-range
      :value="value"
      :enableQuick="false"
      @input="(v) => $emit('input', v)"
      @cancel="updateShow(false)"
      @confirm="updateShow(false)"
    />
  </ai-dialog>
</template>

<script lang="ts">
import { Component, Vue, Prop, Mixins, Watch } from "vue-property-decorator";

import AiDialog from "./AiDialog.vue";
import AiInputDateRange from "./AiInputDateRange.vue";

@Component({
  name: "ai-datetime-picker",
  components: {
    AiDialog,
    AiInputDateRange,
  },
})
export default class Home extends Vue {
  @Prop({ type: Array, default: [] }) value: any;
  @Prop({ type: Boolean, default: false }) show: any;

  updateShow(v) {
    this.$emit("update:show", v);
  }
}
</script>
<style lang="scss" scoped>
.ai-datetime-picker {
  & ::v-deep .h-popup__pannel {
    height: 100%;
  }
}
</style>
