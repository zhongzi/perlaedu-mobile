<template>
  <ai-card class="wrapper zone">
    <template v-slot:body>
      <img :src="zone | safe('cover')" />
    </template>
  </ai-card>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

import AiCard from "@/view/component/AiCard.vue";

@Component({
  components: {
    AiCard,
  },
})
export default class Home extends Vue {
  @Prop({ type: Object, default: null }) zone: any;
}
</script>
<style lang="scss" scoped>
.zone {
  width: 50px;
  height: 50px;
  box-shadow: 0px 4px 6px 0px rgba(226, 226, 226, 0.27);

  img {
    width: 100%;
    height: 100%;
  }
}
</style>
