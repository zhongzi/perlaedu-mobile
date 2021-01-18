<template>
  <hui-tab v-model="curTabIdx" :tabs="innerTabs" :label="label" />
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";

import merge from "lodash/merge";
import filter from "lodash/filter";
import _get from "lodash/get";

@Component
export default class Home extends Vue {
  @Prop({ type: Number, default: 0 }) value: number;
  @Prop({ type: Array, default: () => [] }) tabs: any;
  @Prop({ type: String, default: "label" }) label: string;
  @Prop({ type: Boolean, default: false }) stickable: string;

  curTabIdx: number = 0;

  get innerTabs() {
    return filter(this.tabs, (tab) => {
      return _get(tab, "enabled", true);
    });
  }

  created() {
    this.curTabIdx = this.value;
  }

  @Watch("value")
  onValueChanged() {
    this.curTabIdx = this.value;
  }

  @Watch("curTabIdx")
  onInnerCurTabIdxChanged() {
    this.$emit("input", this.curTabIdx);

    this.stickable &&
      this.$router.replace({
        query: { tab: this.curTabIdx as any },
      });
  }
}
</script>
<style lang="scss" scoped></style>
