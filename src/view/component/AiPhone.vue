<template>
  <ai-button-round-small
    icon="phone"
    :label="label"
    @click.native.stop="onClick"
  />
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

import AiButtonRoundSmall from "./AiButtonRoundSmall.vue";

import isEmpty from "lodash/isEmpty";

@Component({
  name: "ai-phone",
  components: {
    AiButtonRoundSmall,
  },
})
export default class Home extends Vue {
  @Prop({ type: String, default: "联系TA" }) label: string;
  @Prop({ type: String, default: "" }) phone: string;

  onClick() {
    if (isEmpty(this.phone)) return;

    window.location.href = `tel:${this.phone}`;
  }
}
</script>
