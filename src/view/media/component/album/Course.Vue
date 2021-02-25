<script lang="ts">
import { Component, Vue, Mixins } from "vue-property-decorator";

import AlbumCellCourse from "../AlbumCellCourse.vue";
import Base from "./Base.vue";

import isEmpty from "lodash/isEmpty";
import cloneDeep from "lodash/cloneDeep";

@Component
export default class Home extends Mixins(Base) {
  created() {
    this.targetType = "course";

    this.load();
    this.curAlbumComponent = AlbumCellCourse;
  }
  
  resetData(album=null) {

    if(isEmpty(album)) {
      const course = this.$route.params.albumId;
      this.curAlbumComponentProps = {
        course: course,
        merchantId: this.merchantId,
        mode: "detail",
        total: this.curAlbumComponentProps && this.curAlbumComponentProps.total,
      };
      this.targetName = course;
      this.isEditable = this.checkEditable(this.$auth.user.curr_merch_id);
      return
    }

    this.targetName = album.title;
    this.curAlbumComponentProps = {
      course: album.title,
      merchantId: album.merchant_id,
      mode: "detail",
      total:
        this.curAlbumComponentProps && this.curAlbumComponentProps.total,
    };
    this.isEditable = this.checkEditable(album.merchant_id);
  }

  load(callback=null) {
    if (this.targetId && this.targetId > 0) {
      this.loadEntity({
        store: "mediaAlbum",
        id: this.targetId,
        query: {
          extras: "count_link,cover",
        },
        success: (resp) => {
          this.resetData(cloneDeep(resp.data));
          callback && callback();
        },
      });
    } else {
      const course = this.$route.params.albumId;
      this.loadList({
        store: "mediaAlbum",
        query: {
          merchant_id: this.merchantId,
          title: course,
          type: "course",
          extras: "count_link,cover",
        },
        success: resp => {
          if(isEmpty(resp.data.data)) {
            this.resetData();
          } else {
            this.resetData(cloneDeep(resp.data.data[0]));
          }
          callback && callback();
        } 
      });

    }
  }
}
</script>
<style lang="scss" scoped></style>
