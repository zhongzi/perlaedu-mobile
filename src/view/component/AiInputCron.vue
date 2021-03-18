<template>
  <div :class="b()">
    <ai-input :value="value" @input="v => $emit('input', v)" mode="border" />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

import AiInput from "./AiInput.vue";

@Component({
  components: {
    AiInput
  }
})
export default class Home extends Vue {
  @Prop({ type: String, default: ""}) value: string;
}
</script>
<style lang="scss" scoped></style>
