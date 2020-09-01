<template>
  <ai-selection
    :value="isDefaultValue ? '' : value"
    :options="options"
    :enableAllOption="enableAllOption"
    :enableUnsetOption="enableUnsetOption"
    :autoDefault="autoDefault"
    @input="update"
  />
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import AiSelection from "@/view/component/AiSelection.vue";

import { toOptions } from "@/enum";

import map from "lodash/map";
import isEqual from "lodash/isEqual";

@Component({
  components: {
    AiSelection,
  },
})
export default class Home extends Vue {
  @Prop({ type: [String, Number, Array], default: "" }) value:
    | string
    | number
    | any;
  @Prop({ type: Object, default: null }) status: any;
  @Prop({ type: Boolean, default: true }) enableAllOption: boolean;
  @Prop({ type: Boolean, default: false }) enableUnsetOption: boolean;
  @Prop({ type: Boolean, default: true }) autoDefault: boolean;

  get options() {
    return toOptions(this.status);
  }

  get defaultValue() {
    return map(this.options, "value");
  }

  get isDefaultValue() {
    return isEqual(this.value, this.defaultValue);
  }

  update(val) {
    this.$emit("input", val.length > 0 ? val : this.defaultValue);
    return;
  }
}
</script>
