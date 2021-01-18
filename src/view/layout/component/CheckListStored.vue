<template>
  <div :class="b()">
    <ai-list-stored :resource="resource" :query="query">
      <template v-slot:list="{ list }">
        <check-list
          :items="list"
          :selectedItems="selectedItems"
          :enabledSearch="false"
          :labelKey="labelKey"
          :valueKey="valueKey"
          :isMultiple="isMultiple"
          :enabledActions="false"
          @submit="(v) => (innerSelectedItems = v)"
        >
          <template v-slot:item="{ item, label, value }">
            <slot name="item" :item="item" :index="value">
              <ai-cell :title="label" />
            </slot>
          </template>
        </check-list>
      </template>
    </ai-list-stored>
    <ai-fixed-footer>
      <ai-submit-actions
        :submitLabel="submitLabel"
        @cancel="onCancel"
        @submit="onSubmit"
      />
    </ai-fixed-footer>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

import AiCell from "@/view/component/AiCell.vue";
import AiListStored from "@/view/component/AiListStored.vue";
import AiFixedFooter from "@/view/component/AiFixedFooter.vue";
import AiSubmitActions from "@/view/component/AiSubmitActions.vue";

import CheckList from "./CheckList.vue";

import isEmpty from "lodash/isEmpty";

@Component({
  components: {
    AiCell,
    AiListStored,
    AiFixedFooter,
    AiSubmitActions,
    CheckList,
  },
})
export default class Home extends Vue {
  @Prop({ type: String, default: null }) resource: string;
  @Prop({ type: Object, default: null }) query: object;
  @Prop({ type: Array, default: null }) selectedItems: any;
  @Prop({ type: Boolean, default: true }) isMultiple: boolean;
  @Prop({ type: String, default: "title" }) labelKey: string;
  @Prop({ type: String, default: "id" }) valueKey: string;

  innerSelectedItems: any = null;

  get submitLabel() {
    if (!this.isMultiple) return "确认";
    const count =
      (this.selectedItems || []).length +
      (this.innerSelectedItems || []).length;
    return `已选(${count})`;
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
      this.$emit("submit", this.innerSelectedItems);
      return;
    }

    this.$emit("submit", this.innerSelectedItems);
  }
}
</script>
<style lang="scss" scoped>
.check-list {
  width: 100%;
}
</style>
