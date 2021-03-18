<template>
  <ai-popup :value="value" @input="close">
    <notice-interactions-by-recipient
      :recipient="recipient"
      :showTitle="true"
      @input="close"
    />
  </ai-popup>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

import AiPopup from "@/view/component/AiPopup.vue";
import NoticeInteractionsByRecipient from "./NoticeInteractionsByRecipient.vue";

@Component({
  components: {
    AiPopup,
    NoticeInteractionsByRecipient,
  },
})
export default class Home extends Vue {
  @Prop({ type: Boolean, default: null }) value: boolean;
  @Prop({ type: Object, default: null }) recipient: any;

  close(flag = false) {
    this.$emit("input", flag);
  }
}
</script>
<style lang="scss" scoped></style>
