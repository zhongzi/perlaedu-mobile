<template>
  <hui-tab v-model="curTabIdx" :tabs="tabs" :label="label" />
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";

import merge from "lodash/merge";

@Component
export default class Home extends Vue {
  @Prop({ type: Number, default: 0 }) value: number;
  @Prop({ type: Array, default: () => [] }) tabs: any;
  @Prop({ type: String, default: "label" }) label: string;
  @Prop({ type: Boolean, default: false }) stickable: string;

  curTabIdx: number = 0;

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
