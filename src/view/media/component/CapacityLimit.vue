<template>
  <div class="wrapper capacity-limit">
    <div class="capacity">
      <div class="overview">
        <span>
          {{ used | prettyBytes }} /
          {{ total | prettyBytes }}
        </span>
        <span> {{ percentage }}% </span>
      </div>
      <ai-progress :percentage="percentage" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Mixins, Watch } from "vue-property-decorator";

import SyncMixin from "@/mixin/SyncMixin";

import AiProgress from "@/view/component/AiProgress.vue";
import AiButtonRound from "@/view/component/AiButtonRound.vue";

import _get from "lodash/get";

@Component({
  components: {
    AiProgress,
    AiButtonRound,
  },
})
export default class Home extends Mixins(SyncMixin) {
  @Prop({ type: Object, default: null }) merchant: any;

  get total() {
    return _get(this.merchant, "media_capacity_limit", 0);
  }

  get capacity() {
    return this.entity;
  }

  get used() {
    return _get(this.capacity, "capacity.size", 0);
  }

  get percentage() {
    return parseFloat(((this.used * 100) / this.total).toFixed(2));
  }

  created() {
    this.store = "mediaStatistics";
    this.id = "all";
    this.load();
  }

  @Watch("$route", { deep: true })
  onRouteChanged() {
    this.load();
  }

  load() {
    this.loadEntity({
      query: {
        merchant_id: this.merchant.id,
        extras: "capacity",
      },
    });
  }
}
</script>
<style lang="scss" scoped>
.capacity-limit {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 5px 5px 10px;
  margin: 0px 20px;
  border-radius: 8px;

  .capacity {
    flex: 1;

    display: flex;
    flex-direction: column;

    .overview {
      display: flex;
      align-items: center;
      justify-content: space-between;

      font-size: 13px;
      font-weight: 800;
    }
  }
  .button {
    width: 30%;
    min-height: 40px;
    margin-left: 20px;
  }
}
</style>
