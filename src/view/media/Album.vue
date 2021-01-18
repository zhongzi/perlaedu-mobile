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
import { Component, Vue } from "vue-property-decorator";

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
  get type() {
    return this.$route.query.type;
  }
}
</script>
<style lang="scss" scoped></style>
