<template>
  <div :class="b()">
    <div :class="b('coupon')">
      <slot name="coupon">
        <div :class="b('coupon-title')">
          <slot name="left-top">
            {{ title }}
          </slot>
        </div>
        <div :class="b('coupon-value')">
          <slot name="left-bottom">
            <div :class="b('coupon-value-num')">
              <slot name="value">
                <span> {{ value }}</span>
                <span> {{ unit }} </span>
              </slot>
            </div>
            <div :class="b('coupon-value-desc')">
              <slot name="desc">
                {{ desc }}
              </slot>
            </div>
          </slot>
        </div>
      </slot>
    </div>
    <div :class="b('action')" @click="$emit('action-clicked')" v-if="action">
      <slot name="action">
        {{ action }}
      </slot>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component({
  name: "ai-coupon-simple",
})
export default class Home extends Vue {
  @Prop({ type: String, default: "" }) title: string;
  @Prop({ type: [String, Number], default: null }) value: string | number;
  @Prop({ type: String, default: "" }) unit: string;
  @Prop({ type: String, default: "" }) desc: string;
  @Prop({ type: String, default: null }) action: string;
}
</script>
<style lang="scss" scoped>
.ai-coupon-simple {
  width: 100%;
  height: 100px;
}
</style>
