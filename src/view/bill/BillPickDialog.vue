<template>
  <hui-dialog class="dlg-welfare-draw" v-model="showDialog" :hideOnBlur="false">
    <template v-for="item in unpickedItems">
      <bill-card-welfare-pickable
        v-if="!isSelected(item)"
        :item="item"
        :key="item.id"
        @picked="selected(item)"
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
import isEmpty from "lodash/isEmpty";

@Component({
  components: {
    BillCardWelfarePickable,
  },
})
export default class Home extends Mixins(SyncMixin, StopBodyScrollMixin) {
  @Prop({ type: Array, default: [] }) items: any;
  @Prop({ type: Array, default: [] }) pickedItems: any;
  @Prop({ type: Boolean, default: false }) isManager: boolean;

  showDialog: boolean = false;
  selectedItems: any = [];
  isSaved: boolean = false;

  get unpickedItems() {
    return sortBy(
      differenceWith(
        this.items,
        this.selectedItems,
        (src: any, dst: any) => src.id === dst.id
      ),
      ["price"]
    );
  }

  created() {
    this.resetSelectedItems();
    this.onOpen();
    this.SBSAuto = false;
  }

  @Watch("showDialog")
  onOpenChanged() {
    this.stopBodyScroll(this.showDialog);
  }

  @Watch("pickedItems", { deep: true })
  onPickedItemsChanged() {
    this.resetSelectedItems();
  }

  @Watch("unpickedItems", { deep: true })
  onUnpickedItemsChanged() {
    this.onOpen();
  }

  resetSelectedItems() {
    this.selectedItems = cloneDeep(this.pickedItems || []);
  }

  onOpen() {
    if (this.isManager) {
      this.$emit("picked", map(this.items, "id"));
      return;
    }
    if (this.unpickedItems.length > 0) {
      this.showDialog = true;
      return;
    } else {
      this.showDialog = false;
      this.$emit("picked", map(this.selectedItems, "id"));
    }
  }

  isSelected(item) {
    return indexOf(this.selectedItems, item) >= 0;
  }

  selected(item) {
    this.selectedItems = concat(this.selectedItems, item);
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
