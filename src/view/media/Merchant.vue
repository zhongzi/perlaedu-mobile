<template>
  <div class="wrapper media-merchant">
    <ai-button-round @click.native="gotoEditing">
      <i class="iconfont icon-upload" />
      <span>上传作品</span>
    </ai-button-round>
    <album-list class="section" :merchantId="merchantId" />
    <album-list-student class="section" :merchantId="merchantId" />
    <album-list-group class="section" :merchantId="merchantId" />
    <album-list-teacher class="section" :merchantId="merchantId" />
    <album-list-course class="section" :merchantId="merchantId" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

import AiButtonRound from "@/view/component/AiButtonRound.vue";

import AlbumList from "./component/AlbumList.vue";
import AlbumListStudent from "./component/AlbumListStudent.vue";
import AlbumListGroup from "./component/AlbumListGroup.vue";
import AlbumListTeacher from "./component/AlbumListTeacher.vue";
import AlbumListCourse from "./component/AlbumListCourse.vue";

import _get from "lodash/get";

@Component({
  components: {
    AiButtonRound,
    AlbumList,
    AlbumListCourse,
    AlbumListStudent,
    AlbumListGroup,
    AlbumListTeacher,
  },
})
export default class Home extends Vue {
  get merchantId() {
    return this.$route.query._merchant_id_ || this.$auth.user.curr_merch_id;
  }

  gotoEditing() {
    this.$router.push({
      name: "mediaPhotoEditing",
      params: {
        mediaId: "new",
      },
    });
  }
}
</script>
<style lang="scss" scoped>
.media-merchant {
  padding: 20px 10px;

  .uploader {
  }

  .section {
    margin: 15px auto;

    & ::v-deep .ai-card__footer {
      text-align: center;
      font-size: 12px;
      color: #747474;
    }
  }
}
</style>
