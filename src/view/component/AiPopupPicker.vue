<template>
  <hui-popup-picker
    :class="b()"
    :show="open"
    :title="title"
    :value="value"
    :data="list"
    @input="(v) => $emit('selected', v)"
    @update:open="(v) => $emit('update:open', v)"
  />
</template>

<script lang="ts">
import { Component, Vue, Prop, Mixins } from "vue-property-decorator";

import PatchMixin from "@/mixin/PatchMixin";

@Component({
  name: "ai-popup-picker",
})
export default class Home extends Mixins(PatchMixin) {
  @Prop({ type: String, default: "" }) title: string;
  @Prop({ type: Array, default: null }) list: any;
  @Prop({ type: [Object, String, Number], default: null }) value: any;
  @Prop({ type: Boolean, default: true }) open: boolean;
}
</script>
<style lang="scss" scoped>
.ai-popup-picker {
}
</style>
