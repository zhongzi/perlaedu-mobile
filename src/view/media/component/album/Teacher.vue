<script lang="ts">
import { Component, Vue, Mixins } from "vue-property-decorator";

import AlbumCellTeacher from "../AlbumCellTeacher.vue";
import Base from "./Base.vue";

import cloneDeep from "lodash/cloneDeep";

@Component
export default class Home extends Mixins(Base) {
  created() {
    this.targetClass = "Person";
    this.load();
    this.curAlbumComponent = AlbumCellTeacher;
  }

  load() {
    this.loadEntity({
      store: "person",
      id: this.targetId,
      query: {
        extras: "avtar_url",
      },
      success: (resp) => {
        const person = cloneDeep(resp.data);

        this.curAlbumComponentProps = {
          teacher: person,
          merchantId: person.merchant_id,
          mode: "detail",
        };

        this.isEditable =
          this.checkEditable(person.merchant_id, person.openid) ||
          this.checkEditable(person.merchant_id, person.openid_second);
      },
    });
  }
}
</script>
<style lang="scss" scoped></style>
