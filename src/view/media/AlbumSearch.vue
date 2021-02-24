<template>
  <div class="wrapper album-search">
    <ly-search v-model="keyword" />
    <album-list
      class="albums"
      v-if="isCustome"
      :merchantId="merchantId"
      scrollType="scroll"
      :keyword="keyword"
    />
    <album-list-student
      class="albums"
      v-if="isStudent"
      :merchantId="merchantId"
      scrollType="scroll"
      :keyword="keyword"
    />
    <album-list-group
      class="albums"
      v-if="isGroup"
      :merchantId="merchantId"
      scrollType="scroll"
      :keyword="keyword"
    />
    <album-list-teacher
      class="albums"
      v-if="isTeacher"
      :merchantId="merchantId"
      scrollType="scroll"
      :keyword="keyword"
    />
    <album-list-course
      class="albums"
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
import LySearch from "@/view/layout/component/Search.vue";

import _get from "lodash/get";

@Component({
  components: {
    AiInput,
    AlbumList,
    AlbumListStudent,
    AlbumListGroup,
    AlbumListTeacher,
    AlbumListCourse,
    LySearch,
  },
})
export default class Home extends Vue {
  type: string = null;
  keyword = "";
  merchantId: number = null;

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

  created() {
    this.reset();
    console.log(
      (this as any)._uid,
      "created",
      this.type,
      this.$route.meta.keepAlive
    );
  }

  activated() {
    this.reset();
    console.log(
      (this as any)._uid,
      "activated",
      this.type,
      this.$route.meta.keepAlive
    );
  }

  reset() {
    this.type = this.$route.query.type as string;
    this.merchantId = parseInt(
      this.$route.query._merchant_id_ || _get(this.$auth, "user.curr_merch_id")
    );
  }
}
</script>
<style lang="scss" scoped>
.album-search {
  background: #fff;
  .albums {
    margin: 0px 20px;
    border-bottom: 2px solid #000;
  }
}
</style>
