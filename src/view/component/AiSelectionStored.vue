<template>
  <ai-selection-borderless
    :value="value"
    :options="list"
    :label="label"
    :labelKey="labelKey"
    :valueKey="valueKey"
    @input="(val) => $emit('input', val)"
  />
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch, Mixins } from "vue-property-decorator";

import SyncMixin from "@/mixin/SyncMixin";
import AiSelectionBorderless from "./AiSelectionBorderless.vue";

@Component({
  components: {
    AiSelectionBorderless,
  },
})
export default class Home extends Mixins(SyncMixin) {
  @Prop({ type: [String, Number], default: "" }) value: string | number;
  @Prop({ type: String }) resource: string;
  @Prop({ type: Object, default: () => ({}) }) query: object;
  @Prop({ type: Number, default: 100 }) limit: number;
  @Prop({ type: String, default: "" }) label: string;
  @Prop({ type: String, default: "title" }) labelKey: string;
  @Prop({ type: String, default: "id" }) valueKey: string;

  created() {
    this.store = this.resource;
    this.loadList({
      query: this.query,
      limit: this.limit,
    });
  }
}
</script>
