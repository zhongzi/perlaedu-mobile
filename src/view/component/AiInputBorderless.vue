<template>
  <div :class="[b(), { [b('border-bottom')]: showBottomLine }]">
    <ai-input
      :label="label"
      :value="value"
      :type="type"
      :placeholder="placeholder"
      @input="(v) => $emit('input', v)"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

import AiInput from "./AiInput.vue";

@Component({
  name: "ai-input-borderless",
  components: {
    AiInput,
  },
})
export default class Home extends Vue {
  @Prop({ type: String, default: null }) label: string;
  @Prop({ type: [String, Number], default: "" }) value: string | number;
  @Prop({ type: String, default: "text" }) type: string;
  @Prop({ type: Boolean, default: true }) showBottomLine: boolean;
  @Prop({ type: String, default: "请输入内容" }) placeholder: string;
}
</script>
<style lang="scss" scoped>
.ai-input-borderless {
  & ::v-deep .ai-input {
    border: none;
  }

  & ::v-deep input {
    font-size: 13px;
    font-family: MicrosoftYaHei;
    color: rgba(165, 165, 165, 1);
    line-height: 17px;
    letter-spacing: 1px;
  }

  &__border-bottom {
    border-bottom: 1px solid rgba(237, 237, 237, 1);
  }
}
</style>
