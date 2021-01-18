<template>
  <div class="wrapper">
    <div class="wrapper action" @click="moveTo">
      <i class="iconfont icon-editing-move" />
      <span> {{ title }}</span>
    </div>
    <add-links
      :title="title"
      :links="links"
      :open.sync="open"
      :removeable="true"
      @success="moved"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

import AddLinks from "./AddLinks.vue";

import isEmpty from "lodash/isEmpty";

@Component({
  components: {
    AddLinks,
  },
})
export default class Home extends Vue {
  @Prop({ type: Array, default: null }) links: any;

  open = false;
  title = "移动到";

  moveTo() {
    if (isEmpty(this.links)) {
      this.$hui.toast.info("为选择任何对象");
      return;
    }

    this.open = true;
    this.$bus.$emit("add:links:title", this.title);
  }

  moved() {
    this.open = false;
    this.$emit("moved");
  }
}
</script>
<style lang="scss" scoped></style>
