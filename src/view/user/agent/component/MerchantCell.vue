<template>
  <ai-cell
    class="cell"
    :cover="merchant | safe('logo_url')"
    :title="merchant | safe('name')"
    :subtitle="createdAt"
  >
    <template v-slot:right>
      <div class="info" v-if="latestRecharged" :style="mergedStyle">
        <div class="type">{{ rechargedType.text }}</div>
        <div class="money">{{ latestRecharged.amount }} 元</div>
      </div>
    </template>
  </ai-cell>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

import AiCell from "@/view/component/AiCell.vue";
import { PayOrderType } from "@/enum/pay_order";

import _get from "lodash/get";

@Component({
  components: {
    AiCell,
  },
})
export default class Home extends Vue {
  @Prop({ type: Object, default: null }) merchant;

  get latestRecharged() {
    return _get(this.merchant, "latest_recharged");
  }

  get createdAt() {
    return (
      this.latestRecharged &&
      this.$options.filters.defaultDate(this.latestRecharged.created_at)
    );
  }

  get rechargedType() {
    return this.latestRecharged && PayOrderType[this.latestRecharged.type_];
  }

  get mergedStyle() {
    return (
      this.rechargedType && {
        color: this.rechargedType.color,
      }
    );
  }
}
</script>
<style lang="scss" scoped>
.cell {
  margin: 10px 0px 0px;
  padding: 10px;
  background: #fff;
  border-radius: 8px;

  & ::v-deep .ai-cell__left-cover {
    width: 50px;
  }

  .info {
    text-align: right;
  }
}
</style>
