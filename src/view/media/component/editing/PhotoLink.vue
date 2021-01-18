<template>
  <div class="wrapper editing-link">
    <picker-student :media="media" />
    <picker-teacher :media="media" />
    <picker-group :media="media" />
    <picker-course :media="media" />
    <picker-album :media="media" />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

import PickerStudent from "./PickerStudent.vue";
import PickerTeacher from "./PickerTeacher.vue";
import PickerGroup from "./PickerGroup.vue";
import PickerCourse from "./PickerCourse.vue";
import PickerAlbum from "./PickerAlbum.vue";

@Component({
  components: {
    PickerStudent,
    PickerTeacher,
    PickerGroup,
    PickerCourse,
    PickerAlbum,
  },
})
export default class Home extends Vue {
  @Prop({ type: Object, default: null }) media: any;
}
</script>
<style lang="scss" scoped></style>
