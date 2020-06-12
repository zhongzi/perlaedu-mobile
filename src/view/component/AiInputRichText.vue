<template>
  <div :class="b()">
    <ai-cell
      :class="b('cell')"
      :title="label"
      :subtitle="remark"
      @click.native="showPopup = true"
    >
      <template v-slot:right>
        <i class="iconfont icon-direction" />
      </template>
    </ai-cell>
    <hui-popup v-model="showPopup" position="right">
      <div :class="b('popup')">
        <ai-rich-text-editor
          :class="b('popup-editor')"
          :value="value"
          :imageType="imageType"
          :imagePrefix="imagePrefix"
          @input="(v) => $emit('input', v)"
        />
        <hui-button @click.native="showPopup = false" :class="b('popup-close')">
          确认
        </hui-button>
      </div>
    </hui-popup>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";

import AiCell from "./AiCell.vue";
import AiRichTextEditor from "./AiRichTextEditor.vue";

@Component({
  name: "ai-input-rich-text",
  components: {
    AiCell,
    AiRichTextEditor,
  },
})
export default class Home extends Vue {
  @Prop({ type: [String, Array], default: null }) value: any;
  @Prop({ type: String, default: null }) label: string;
  @Prop({ type: String, default: null }) remark: string;
  @Prop({ type: String, default: null }) imageType: string;
  @Prop({ type: String, default: null }) imagePrefix: string;

  showPopup: boolean = false;
}
</script>
<style lang="scss" scoped>
.ai-input-rich-text {
  &__popup {
    height: 100vh;

    &-close {
      width: 60%;
      height: 50px;
      margin: 20px 20%;
    }
  }
}
</style>
