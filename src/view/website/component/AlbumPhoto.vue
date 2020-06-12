<template>
  <div class="wrapper">
    <img class="cover" :src="photo.cover | alioss({ width: 150 })" />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component
export default class Home extends Vue {
  @Prop({ type: Object, default: null }) photo: any;
}
</script>
<style lang="scss" scoped>
.wrapper {
  padding: 5px;

  .cover {
    max-width: 100%;
    max-height: 100%;
    background: rgba(216, 216, 216, 1);
    border-radius: 4px;
  }
}
</style>
