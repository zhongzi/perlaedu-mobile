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
    const targetId = parseInt(this.targetId);
    if (!targetId) {
      this.curAlbumComponentProps = {
        course: this.targetId,
        merchantId: this.$route.query.merchantId,
        mode: "detail",
      };
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
        this.curAlbumComponentProps = {
          course: album.title,
          merchantId: album.merchant_id,
          mode: "detail",
          total: album.count_link,
        };

        this.isEditable = this.checkEditable(album.merchant_id, album.openid);
        this.isDeletable = this.isEditable;
      },
    });
  }
}
</script>
<style lang="scss" scoped></style>
