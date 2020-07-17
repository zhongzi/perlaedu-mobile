<template>
  <hui-popup v-model="showPopup" @on-hide="onCancel" position="bottom">
    <div :class="b()">
      <div :class="b('menus')">
        <ai-selection
          :class="b('menu')"
          label="字体大小"
          v-model="value.font_size"
          :options="fontSizes"
        />
        <ai-selection
          :class="b('menu')"
          label="字体重量"
          v-model="value.font_weight"
          :options="fontWeights"
        />
        <ai-selection
          :class="b('menu')"
          label="字体颜色"
          v-model="value.font_color"
          :options="fontColors"
        >
          <template v-slot:option="{ option, value, label }">
            <i class="iconfont icon-square" :style="{ color: value }" />
            <span> {{ label }} </span>
          </template>
        </ai-selection>
      </div>
      <ai-input-textarea v-model="innerValue.text" :class="b('textarea')" />
      <ai-submit-actions
        @submit="saveValue"
        @cancel="onCancel"
        submitLabel="确认"
      />
    </div>
  </hui-popup>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch, Mixins } from "vue-property-decorator";
import PatchMixin from "@/mixin/PatchMixin";

import AiFixedFooter from "./AiFixedFooter.vue";
import AiInputTextarea from "./AiInputTextarea.vue";
import AiSelection from "./AiSelection.vue";
import AiSubmitActions from "./AiSubmitActions.vue";

import isEqual from "lodash/isEqual";
import cloneDeep from "lodash/cloneDeep";
import merge from "lodash/merge";

@Component({
  name: "ai-rich-text-text-unit",
  components: {
    AiFixedFooter,
    AiInputTextarea,
    AiSelection,
    AiSubmitActions,
  },
})
export default class Home extends Mixins(PatchMixin) {
  @Prop({ type: Object, default: () => ({}) }) value: object;

  showPopup: boolean = true;
  innerValue: any = {
    font_size: "",
    font_weight: "",
    font_color: "",
    text: "",
  };

  created() {
    this.resetInnerValue();
  }

  get fontSizes() {
    return [
      { key: "标准", value: "15px" },
      { key: "加大", value: "18px" },
      { key: "减小", value: "12px" },
    ];
  }

  get fontWeights() {
    return [
      { key: "正常", value: "normal" },
      { key: "加粗", value: "bold" },
      { key: "变细", value: "lighter" },
    ];
  }

  get fontColors() {
    return [
      { key: "黑色", value: "black" },
      { key: "灰色", value: "grey" },
      { key: "红色", value: "red" },
      { key: "橙色", value: "orange" },
      { key: "蓝色", value: "blue" },
    ];
  }

  @Watch("value", { deep: true })
  onValueChanged() {
    this.resetInnerValue();
  }

  resetInnerValue() {
    if (isEqual(this.innerValue, this.value)) return;
    this.innerValue = merge(this.innerValue, this.value);
  }

  saveValue() {
    this.$emit("input", cloneDeep(this.innerValue));
  }

  onCancel() {
    this.$emit("close");
  }
}
</script>
<style lang="scss" scoped>
.ai-rich-text-text-unit {
  padding: 15px;
  &__menus {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  &__textarea {
    max-height: 500px;
    overflow-y: scroll;
  }
}
</style>
