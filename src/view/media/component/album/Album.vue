<script lang="ts">
import { Component, Vue, Mixins } from "vue-property-decorator";

import AlbumCell from "../AlbumCell.vue";
import Base from "./Base.vue";

import cloneDeep from "lodash/cloneDeep";

@Component
export default class Home extends Mixins(Base) {
  created() {
    this.store = "mediaAlbum";
    this.load();
    this.curAlbumComponent = AlbumCell;
  }

  load() {
    (this.id = this.targetId),
      this.loadEntity({
        store: "mediaAlbum",
        id: this.id,
        query: {
          extras: "cover",
        },
        success: (resp) => {
          const album = cloneDeep(resp.data);
          const total =
            this.curAlbumComponentProps && this.curAlbumComponentProps.total;

          this.isEditable = this.checkEditable(album.merchant_id);
          this.isDeletable = this.isEditable;

          this.targetName = album.title;
          this.targetType = "album";

          this.$nextTick(() => {
            this.curAlbumComponentProps = {
              album: this.entity,
              merchantId: album.merchant_id,
              mode: "detail",
              total: total,
              isEditable: this.isEditable,
            };
          });
        },
      });
  }
}
</script>
<style lang="scss" scoped></style>
