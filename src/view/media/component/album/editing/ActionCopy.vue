<template>
  <div class="wrapper">
    <div class="action" @click="copyTo">
      <i class="iconfont icon-editing-copy" />
      <span> {{ title }}</span>
    </div>
    <add-links
      :title="title"
      :links="links"
      :open.sync="open"
      @success="open = false"
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
  title = "复制到";

  copyTo() {
    if (isEmpty(this.links)) {
      this.$hui.toast.info("为选择任何对象");
      return;
    }
    this.open = true;
    this.$bus.$emit("add:links:title", this.title);
  }
}
</script>
<style lang="scss" scoped></style>
