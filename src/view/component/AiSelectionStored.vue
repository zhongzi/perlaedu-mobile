<template>
  <ai-selection
    :value="value"
    :options="list"
    :labelKey="labelKey"
    :valueKey="valueKey"
    @input="(val) => $emit('input', val)"
  />
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch, Mixins } from "vue-property-decorator";

import SyncMixin from "@/mixin/SyncMixin";
import AiSelection from "./AiSelection.vue";

@Component({
  components: {
    AiSelection,
  },
})
export default class Home extends Mixins(SyncMixin) {
  @Prop({ type: [String, Number], default: "" }) value: string | number;
  @Prop({ type: String }) resource: string;
  @Prop({ type: Object, default: () => ({}) }) query: object;
  @Prop({ type: Number, default: 100 }) limit: number;
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
