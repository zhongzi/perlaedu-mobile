<template>
  <hui-dialog class="dlg-welfare-draw" v-model="open">
    <template v-for="item in unpickedItems">
      <bill-card-welfare-pickable
        :item="item"
        :key="item.id"
        v-if="!checkedInSet(item)"
        @picked="pullInSet(item)"
        class="dlg-welfare-draw__item"
      />
    </template>
  </hui-dialog>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch, Mixins } from "vue-property-decorator";

import SyncMixin from "@/mixin/SyncMixin";
import StopBodyScrollMixin from "@/mixin/StopBodyScrollMixin";

import BillCardWelfarePickable from "./component/BillCardWelfarePickable.vue";

import differenceWith from "lodash/differenceWith";
import cloneDeep from "lodash/cloneDeep";
import map from "lodash/map";
import indexOf from "lodash/indexOf";
import concat from "lodash/concat";
import sortBy from "lodash/sortBy";

@Component({
  components: {
    BillCardWelfarePickable,
  },
})
export default class Home extends Mixins(SyncMixin, StopBodyScrollMixin) {
  @Prop({ type: Array, default: [] }) items: any;
  @Prop({ type: Array, default: [] }) pickedItems: any;
  @Prop({ type: Boolean, default: false }) isManager: boolean;

  welfareItems: any = [];
  open: boolean = false;

  get unpickedItems() {
    return sortBy(
      differenceWith(
        this.items,
        this.welfareItems,
        (src, dst) => src.id === dst.id
      ),
      ["price"]
    );
  }

  created() {
    this.welfareItems = cloneDeep(this.pickedItems || []);
    this.onOpen();
  }

  @Watch("pickedItems", { deep: true })
  onPickedItemsChanged() {
    this.welfareItems = cloneDeep(this.pickedItems || []);
  }

  @Watch("unpickedItems", { deep: true })
  onUnpickedItemsChanged() {
    this.onOpen();
  }

  @Watch("open")
  onOpenChanged() {
    this.stopBodyScroll(this.open);
  }

  onOpen() {
    if (this.isManager) {
      this.$emit("picked", map(this.items, "id"));
      return;
    }
    if (this.unpickedItems.length > 0) {
      this.open = true;
      return;
    } else {
      this.open = false;
      this.$emit("picked", map(this.welfareItems, "id"));
    }
  }

  checkedInSet(item) {
    return indexOf(this.welfareItems, item) >= 0;
  }

  pullInSet(item) {
    this.welfareItems = concat(this.welfareItems, item);
    this.$forceUpdate();
    return;
  }
}
</script>
<style lang="scss" scoped>
.dlg-welfare-draw {
  & ::v-deep .h-dialog__mask {
    background: rgba(0, 0, 0, 0.85);
  }
  & ::v-deep .h-dialog__dialog {
    background: rgba(255, 255, 255, 0);
  }
  &__item {
    margin: 10px 0px;
  }
}
</style>
