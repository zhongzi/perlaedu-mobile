<template>
  <div :class="b()">
    <hui-button
      v-if="cancelLabel && cancelLabel.length > 0"
      :class="b('cancel')"
      @click.native="$emit('cancel')"
    >
      {{ cancelLabel }}
    </hui-button>
    <hui-button
      v-if="submitLabel && submitLabel.length > 0"
      :class="b('submit')"
      @click.native="$emit('submit')"
      type="primary"
    >
      {{ submitLabel }}
    </hui-button>
    <hui-button
      v-if="deleteLabel && deleteLabel.length > 0"
      :class="b('delete')"
      @click.native="$emit('deleted')"
      type="error"
    >
      {{ deleteLabel }}
    </hui-button>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";

@Component({
  name: "ai-submit-actions",
})
export default class Home extends Vue {
  @Prop({ type: String, default: "取消" }) cancelLabel: string;
  @Prop({ type: String, default: "确认" }) submitLabel: string;
  @Prop({ type: String, default: "" }) deleteLabel: string;
}
</script>

<style lang="scss" scoped>
.ai-submit-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 20px;

  &__cancel {
    width: 126px;
    height: 48px;
    background: rgba(239, 239, 239, 1);
    border-radius: 25px;
    border: none;

    font-size: 14px;
    font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
    font-weight: bold;
    color: rgba(155, 155, 155, 1);
    line-height: 19px;
    letter-spacing: 1px;
  }

  &__submit {
    width: 160px;
    height: 48px;
    background: rgba(250, 142, 69, 1);
    border-radius: 25px;
    border: none;

    font-size: 14px;
    font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
    font-weight: bold;
    color: rgba(255, 255, 255, 1);
    line-height: 19px;
    letter-spacing: 1px;
  }
}
</style>
