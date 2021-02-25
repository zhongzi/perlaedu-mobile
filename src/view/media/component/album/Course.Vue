<script lang="ts">
import { Component, Vue, Mixins } from "vue-property-decorator";

import AlbumCellCourse from "../AlbumCellCourse.vue";
import Base from "./Base.vue";

import cloneDeep from "lodash/cloneDeep";

@Component
export default class Home extends Mixins(Base) {
  created() {
    this.load();
    this.curAlbumComponent = AlbumCellCourse;
  }

  load() {
    const targetId = this.targetId;
    const course = this.$route.params.albumId;
    if (!targetId || targetId <= 0) {
      this.curAlbumComponentProps = {
        course: course,
        merchantId: this.merchantId,
        mode: "detail",
        total: this.curAlbumComponentProps && this.curAlbumComponentProps.total,
      };
      this.isEditable = this.checkEditable(this.$auth.user.curr_merch_id);
      return;
    }

    this.loadEntity({
      store: "mediaAlbum",
      id: this.targetId,
      query: {
        extras: "count_link,cover",
      },
      success: (resp) => {
        const album = cloneDeep(resp.data);

        this.targetName = album.title;
        this.targetType = "course";

        this.curAlbumComponentProps = {
          course: album.title,
          merchantId: album.merchant_id,
          mode: "detail",
          total:
            this.curAlbumComponentProps && this.curAlbumComponentProps.total,
        };

        this.isEditable = this.checkEditable(album.merchant_id);
      },
    });
  }
}
</script>
<style lang="scss" scoped></style>
