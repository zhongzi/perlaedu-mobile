<template>
  <div class="wrapper album">
    <album-course v-if="type === 'course'" />
    <album-group v-else-if="type === 'group'" />
    <album-Student v-else-if="type === 'student'" />
    <album-teacher v-else-if="type === 'teacher'" />
    <album v-else />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";

import Album from "./component/album/Album.vue";
import AlbumCourse from "./component/album/Course.vue";
import AlbumGroup from "./component/album/Group.vue";
import AlbumStudent from "./component/album/Student.vue";
import AlbumTeacher from "./component/album/Teacher.vue";

@Component({
  components: {
    Album,
    AlbumCourse,
    AlbumGroup,
    AlbumTeacher,
    AlbumStudent,
  },
})
export default class Home extends Vue {
  type: string = null;

  created() {
    console.log((this as any)._uid, "created", this.type);
    this.resetType();
  }

  activated() {
    this.resetType();
    console.log((this as any)._uid, "activated", this.type);
  }

  @Watch("$route", { deep: true })
  onRouteChanged() {
    return this.resetType();
  }

  resetType() {
    this.type = this.$route.query.type as string;
  }
}
</script>
<style lang="scss" scoped></style>
