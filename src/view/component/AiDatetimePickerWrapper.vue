<template>
  <div>
    <div :class="b()">
      <div :class="b('free-picker')">
        <i class="iconfont icon-date-range" />
        <div :class="b('free-picker-info')">
          <p>{{ value && value[0] | defaultDay }}</p>
          <p>{{ value && value[1] | defaultDay }}</p>
        </div>
        <i
          class="iconfont icon-funnel show-picker"
          @click="showPicker = true"
        />
      </div>
      <ai-datetime-unit-picker
        :value="value"
        :class="b('quick')"
        @input="(v) => $emit('input', v)"
      />
    </div>
    <ai-datetime-picker
      v-model="value"
      :show.sync="showPicker"
      @input="(v) => $emit('input', v)"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

import AiDatetimePicker from "./AiDatetimePicker.vue";
import AiDatetimeUnitPicker from "./AiDatetimeUnitPicker.vue";

@Component({
  name: "ai-datetime-picker-wrapper",
  components: {
    AiDatetimeUnitPicker,
    AiDatetimePicker,
  },
})
export default class Home extends Vue {
  @Prop({ type: Array, default: null }) value: any;

  showPicker: boolean = false;
}
</script>
<style lang="scss" scoped>
.ai-datetime-picker-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;

  &__free-picker {
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-width: 130px;

    &-info {
      font-size: 12px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #4a4a4a;
      line-height: 17px;
    }

    .show-picker {
      font-size: 20px;
      color: rgba(252, 142, 68, 0.8);
      background: #fff;
      padding: 0px 3px;
      margin-left: 5px;
    }
  }

  &__quick-picker {
    max-width: 130px;
  }
}
</style>
