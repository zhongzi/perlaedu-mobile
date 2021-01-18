<script lang="ts">
import { Component, Vue, Mixins } from "vue-property-decorator";

import AlbumCellGroup from "../AlbumCellGroup.vue";
import Base from "./Base.vue";

import _get from "lodash/get";
import cloneDeep from "lodash/cloneDeep";

@Component
export default class Home extends Mixins(Base) {
  created() {
    this.targetClass = "Group";
    this.load();
    this.curAlbumComponent = AlbumCellGroup;
  }

  load() {
    this.loadEntity({
      store: "group",
      id: this.targetId,
      query: {
        extras: "teacher, teacher_second",
      },
      success: (resp) => {
        const group = cloneDeep(resp.data);

        this.targetName = group.name;
        this.targetType = "group";

        this.curAlbumComponentProps = {
          group: group,
          merchantId: group.merchant_id,
          mode: "detail",
          total:
            this.curAlbumComponentProps && this.curAlbumComponentProps.total,
        };

        this.isEditable =
          this.checkEditable(
            group.merchant_id,
            null,
            _get(group, "teacher.user_id")
          ) ||
          this.checkEditable(
            group.merchant_id,
            null,
            _get(group, "teacher_second.user_id")
          );
      },
    });
  }
}
</script>
<style lang="scss" scoped></style>
