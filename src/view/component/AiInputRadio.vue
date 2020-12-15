<template>
  <div :class="b()">
    <input
      :name="group"
      type="radio"
      :value="value"
      @change="onChange"
      :checked="checked"
      ref="radio"
    />
    <slot>
      <ai-title :title="title" :subtitle="subtitle" @click.native="onChecked">
        <template v-slot>
          <slot name="subtitle" />
        </template>
      </ai-title>
    </slot>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

import AiTitle from "./AiTitle.vue";

@Component({
  name: "ai-input-radio",
  components: {
    AiTitle,
  },
})
export default class Home extends Vue {
  @Prop({ type: String }) value: string;
  @Prop({ type: String, default: "" }) title: string;
  @Prop({ type: String, default: "" }) subtitle: string;
  @Prop({ type: Boolean, default: false }) checked: boolean;
  @Prop({ type: String, default: "radio" }) group: string;

  onChange(e) {
    this.$emit("change", e.target.defaultValue);
  }

  onChecked() {
    (this.$refs.radio as any).checked = true;
    this.$emit("change", this.value);
  }
}
</script>
<style lang="scss" scoped>
.ai-input-radio {
  display: flex;

  input {
    margin-right: 10px;
  }
}
</style>
