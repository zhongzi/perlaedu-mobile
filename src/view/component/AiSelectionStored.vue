<template>
  <ai-selection
    :value="value ? value + '' : ''"
    :options="(presetOptions || []).concat(list)"
    :label="label"
    :labelKey="labelKey"
    :valueKey="valueKey"
    :enableAllOption="enableAllOption"
    :enableUnsetOption="enableUnsetOption"
    :unsetOptionLabel="unsetOptionLabel"
    :mode="mode"
    :autoDefault="autoDefault"
    :presetOptions="presetOptions"
    @selected="(o) => $emit('selected', o)"
    @input="(val) => $emit('input', val)"
  >
    <template v-slot:left>
      <slot name="left" />
    </template>
  </ai-selection>
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
  @Prop({ type: String, default: "" }) label: string;
  @Prop({ type: String, default: "title" }) labelKey: string;
  @Prop({ type: String, default: "id" }) valueKey: string;
  @Prop({ type: Boolean, default: false }) enableAllOption: boolean;
  @Prop({ type: Boolean, default: false }) enableUnsetOption: boolean;
  @Prop({ type: String, default: "暂不设置" }) unsetOptionLabel: string;
  @Prop({ type: Boolean, default: true }) autoDefault: boolean;
  @Prop({ type: String, default: "" }) mode: string;
  @Prop({ type: Array, default: null }) presetOptions: any;

  created() {
    this.store = this.resource;
    this.loadList({
      reset: true,
      query: Object.assign(
        {
          limit: this.limit,
        },
        this.query
      ),
    });
  }
}
</script>
