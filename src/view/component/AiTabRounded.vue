<template>
  <hui-tab-rounded v-model="curTabIdx" :tabs="tabs" :label="label" />
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";

import merge from "lodash/merge";

@Component
export default class Home extends Vue {
  @Prop({ type: Number, default: 0 }) value: number;
  @Prop({ type: Array, default: () => [] }) tabs: any;
  @Prop({ type: String, default: "label" }) label: string;

  curTabIdx: number = 0;

  created() {
    this.reset();
  }

  @Watch("curTabIdx")
  onInnerCurTabIdxChanged() {
    this.$emit("input", this.curTabIdx);

    this.$router.push({
      query: { tab: this.curTabIdx as any },
    });
  }

  @Watch("$route", { deep: true })
  onRrouteChanged() {
    this.reset();
  }

  reset() {
    this.curTabIdx = parseInt(this.$route.query.tab as any) || this.value;
  }
}
</script>
<style lang="scss" scoped>
.customer-detail {
  padding: 10px;
  .header {
    margin-bottom: 10px;
  }
}
</style>
