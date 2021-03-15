<template>
  <div class="wrapper">
    <img class="cover" :src="innerImage" @load="onLoaded" />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component
export default class Home extends Vue {
  @Prop({ type: Object, default: null }) photo: any;
  @Prop({ type: String, default: null }) image: string;

  get innerImage() {
    return (
      this.image ||
      this.$options.filters.alioss(this.photo.cover, { width: 100 })
    );
  }

  onLoaded() {
    this.$bus.$emit("infinite:scroll:refresh");
  }
}
</script>
<style lang="scss" scoped>
.wrapper {
  .cover {
    width: 100%;
    max-height: 100%;
    background: rgba(216, 216, 216, 1);
    border-radius: 4px;
  }
}
</style>
