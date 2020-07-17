<template>
  <div class="wrapper add-course-entry" @click="openCouseEditing">
    <i class="iconfont icon-plus-circle plus-circle" />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component
export default class Home extends Vue {
  @Prop({ type: Object, default: null }) merchant: any;

  openCouseEditing() {
    this.$router.push({
      name: "websiteEditingCourse",
      params: {
        courseId: "new",
      },
    });
  }
}
</script>
<style lang="scss" scoped>
.add-course-entry {
  margin: 10px 0px;

  i {
    font-size: 40px;
    color: rgba(195, 195, 195, 1);
  }
}
</style>
