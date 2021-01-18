<template>
  <div :class="b()">
    <!--既有样式需要如此嵌套-->
    <div class="layout-ui">
      <section class="container">
        <div class="xsxz" style="padding-top: 0px">
          <search v-model="keyword" v-if="enabledSearch" />
          <div class="list" style="width: 100%">
            <template v-for="item in items">
              <div :class="[b('item'), 'item']" :key="getValue(item)">
                <slot
                  name="item"
                  :item="item"
                  :label="getLabel(item)"
                  :value="getValue(item)"
                >
                  <span> {{ getValue(item) }} </span>
                </slot>
                <check-box
                  :checked="isChecked(item)"
                  :uncheckable="isUnCheckable(item)"
                  :isMultiple="isMultiple"
                  @update:checked="(isChecked) => onSwitch(item, isChecked)"
                />
              </div>
            </template>
          </div>
        </div>
      </section>
    </div>
    <ai-fixed-footer v-if="enabledActions">
      <ai-submit-actions
        :submitLabel="submitLabel"
        @cancel="onCancel"
        @submit="onSubmit"
      />
    </ai-fixed-footer>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";

import AiFixedFooter from "@/view/component/AiFixedFooter.vue";
import AiSubmitActions from "@/view/component/AiSubmitActions.vue";

import Search from "./Search.vue";
import CheckBox from "./CheckBox.vue";

import _get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import trim from "lodash/trim";
import cloneDeep from "lodash/cloneDeep";
import pull from "lodash/cloneDeep";
import concat from "lodash/concat";
import filter from "lodash/filter";
import find from "lodash/find";
import remove from "lodash/remove";

@Component({
  name: "check-list",
  components: {
    AiFixedFooter,
    AiSubmitActions,
    Search,
    CheckBox,
  },
})
export default class Home extends Vue {
  @Prop({ type: Array, default: null }) items: any;
  @Prop({ type: Array, default: null }) selectedItems: any;

  // 外部传入已选项目是否可取消
  // - 可， 则表示全量修改，则输出应该是最终全量选择结果
  // -不可，则表示增量选择，则输出应该是增量选择结果, 删除需要外部介入处理
  @Prop({ type: Boolean, default: false }) cancelable: boolean;

  // 可否多选
  @Prop({ type: Boolean, default: true }) isMultiple: boolean;
  @Prop({ type: Boolean, default: true }) enabledSearch: boolean;
  @Prop({ type: Boolean, default: true }) enabledActions: boolean;

  @Prop({ type: String, default: "title" }) labelKey: string;
  @Prop({ type: String, default: "id" }) valueKey: string;

  keyword: string = null;
  innerSelectedItems: any = null;

  get submitLabel() {
    if (!this.isMultiple) return "确认";
    const count =
      (this.selectedItems || []).length +
      (this.innerSelectedItems || []).length;
    return `已选(${count})`;
  }

  get filteredItems() {
    if (this.enabledSearch && !isEmpty(trim(this.keyword))) {
      return filter(this.items, (item) => {
        const label = this.getLabel(item);
        return label.search(trim(this.keyword)) >= 0;
      });
    }
    return this.items;
  }

  created() {
    this.resetInnerSelectedItems();
  }

  @Watch("selectedItems", { deep: true })
  onSelectedItemsChanged() {
    this.resetInnerSelectedItems();
  }

  getLabel(item) {
    return !isEmpty(this.labelKey) ? _get(item, this.labelKey) : item;
  }

  getValue(item) {
    return !isEmpty(this.valueKey) ? _get(item, this.valueKey) : item;
  }

  resetInnerSelectedItems() {
    if (!this.cancelable) return;

    this.resetInnerSelectedItems = cloneDeep(this.selectedItems);
  }

  compareItemByValue(left, right) {
    return this.getValue(left) == this.getValue(right);
  }

  isUnCheckable(item) {
    return (
      !this.cancelable &&
      find(this.selectedItems, (selectedItem) => {
        return this.compareItemByValue(selectedItem, item);
      })
    );
  }

  isChecked(item) {
    return !!find(this.innerSelectedItems, (selectedItem) => {
      return this.compareItemByValue(selectedItem, item);
    });
  }

  onSwitch(item, isChecked) {
    this.innerSelectedItems = this.innerSelectedItems || [];
    if (isChecked) {
      this.innerSelectedItems = this.isMultiple
        ? concat(this.innerSelectedItems, item)
        : [item];
    } else {
      this.innerSelectedItems = remove(
        this.innerSelectedItems,
        (selectedItem) => {
          return !this.compareItemByValue(selectedItem, item);
        }
      );
    }

    !this.enabledActions && this.onSubmit();
  }

  onCancel() {
    this.$emit("cancel");
  }

  onSubmit() {
    if (!this.isMultiple) {
      if (isEmpty(this.innerSelectedItems)) {
        this.$hui.toast.error("未选中任何对象");
        return;
      }
      this.$emit("submit", this.innerSelectedItems[0]);
      return;
    }

    this.$emit("submit", this.innerSelectedItems);
  }
}
</script>
<style lang="scss" scoped>
.check-list {
  .check-list__item {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}
</style>
