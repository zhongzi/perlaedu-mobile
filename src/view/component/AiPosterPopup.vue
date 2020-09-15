<template>
  <ai-dialog :class="b()" :value="value" @input="(v) => $emit('input', v)">
    <ai-poster :poster="poster" :context="context" :containerId="containerId" />
  </ai-dialog>
</template>
<script lang="ts">
import { Component, Vue, Prop, Mixins, Watch } from "vue-property-decorator";

import AiDialog from "./AiDialog.vue";
import AiPoster from "./AiPoster.vue";

@Component({
  name: "ai-poster-popup",
  components: {
    AiDialog,
    AiPoster,
  },
})
export default class Home extends Vue {
  @Prop({ type: Boolean, default: false }) value: boolean;
  @Prop({ type: Object, default: null }) poster: any;
  @Prop({ type: Object, default: () => ({}) }) context: any;
  @Prop({ type: String, default: "poster-container-id" }) containerId: string;
}
</script>
<style lang="scss" scoped>
.ai-poster-popup {
  & ::v-deep .h-dialog__dialog {
    background: inherit;
  }
}
</style>
