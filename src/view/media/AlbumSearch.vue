<template>
  <div class="wrapper album-search">
    <ai-input v-model="keyword" :placeholder="placeholder" mode="border">
      <i class="iconfont icon-search" />
    </ai-input>
    <album-list
      v-if="isCustome"
      :merchantId="merchantId"
      scrollType="scroll"
      :keyword="keyword"
    />
    <album-list-student
      v-if="isStudent"
      :merchantId="merchantId"
      scrollType="scroll"
      :keyword="keyword"
    />
    <album-list-group
      v-if="isGroup"
      :merchantId="merchantId"
      scrollType="scroll"
      :keyword="keyword"
    />
    <album-list-teacher
      v-if="isTeacher"
      :merchantId="merchantId"
      scrollType="scroll"
      :keyword="keyword"
    />
    <album-list-course
      v-if="isCourse"
      :merchantId="merchantId"
      scrollType="scroll"
      :keyword="keyword"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

import AiInput from "@/view/component/AiInput.vue";

import AlbumList from "./component/AlbumList.vue";
import AlbumListStudent from "./component/AlbumListStudent.vue";
import AlbumListGroup from "./component/AlbumListGroup.vue";
import AlbumListTeacher from "./component/AlbumListTeacher.vue";
import AlbumListCourse from "./component/AlbumListCourse.vue";

import _get from "lodash/get";

@Component({
  components: {
    AiInput,
    AlbumList,
    AlbumListStudent,
    AlbumListGroup,
    AlbumListTeacher,
    AlbumListCourse,
  },
})
export default class Home extends Vue {
  keyword = "";
  get merchantId() {
    return this.$route.query._merchant_id_ || this.$auth.user.curr_merch_id;
  }

  get type() {
    return this.$route.query.type;
  }

  get isCustome() {
    return !this.type;
  }

  get isStudent() {
    return this.type === "student";
  }

  get isGroup() {
    return this.type === "group";
  }

  get isTeacher() {
    return this.type === "teacher";
  }

  get isCourse() {
    return this.type === "course";
  }

  get placeholder() {
    if (this.isCustome) {
      return "搜索自定义相册";
    }
    if (this.isStudent) {
      return "搜索学生相册";
    }
    if (this.isGroup) {
      return "搜索班级相册";
    }
    if (this.isTeacher) {
      return "搜索老师相册";
    }
    if (this.isCourse) {
      return "搜索科目相册";
    }
    return "输入关键词搜索";
  }
}
</script>
<style lang="scss" scoped>
.album-search {
  padding: 20px;
}
</style>
