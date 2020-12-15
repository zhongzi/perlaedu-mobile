<template>
  <div class="picker-person">
    <ai-popup :value="open" @input="(v) => $emit('update:open', v)">
      <div class="layout-ui">
        <section class="container">
          <div class="xsxz">
            <search v-model="keyword" />
            <ai-list-stored resource="person" :query="innerQuery">
              <template v-slot:list="{ list }">
                <div class="list" style="width: 100%;">
                  <div class="item" v-for="item in list" :key="item.id">
                    <div class="tag" v-if="showInitial(item)">
                      {{ item.initial }}
                    </div>
                    <div class="cont">
                      <picker-person-cell
                        :person="item"
                        :isMutil="isMutil"
                        :checked="checkSelected(item)"
                        :uncheckable="checkUnselectable(item)"
                      />
                    </div>
                  </div>
                </div>
              </template>
            </ai-list-stored>
          </div>
        </section>
      </div>
      <ai-fixed-footer>
        <ai-submit-actions
          @cancel="onCancel"
          @submit="onSubmit"
          :submitLabel="submitLabel"
        />
      </ai-fixed-footer>
    </ai-popup>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";

import AiListStored from "@/view/component/AiListStored.vue";
import AiFixedFooter from "@/view/component/AiFixedFooter.vue";
import AiSubmitActions from "@/view/component/AiSubmitActions.vue";
import AiPopup from "@/view/component/AiPopup.vue";

import Search from "./Search.vue";
import PickerPersonCell from "./PickerPersonCell.vue";

import isEmpty from "lodash/isEmpty";
import trim from "lodash/trim";
import cloneDeep from "lodash/cloneDeep";
import pull from "lodash/cloneDeep";
import concat from "lodash/concat";

@Component({
  components: {
    AiPopup,
    AiFixedFooter,
    AiSubmitActions,
    AiListStored,
    Search,
    PickerPersonCell,
  },
})
export default class Home extends Vue {
  @Prop({ type: Boolean, default: false }) open: boolean;
  @Prop({ type: Object, default: null }) query: any;
  @Prop({ type: Boolean, default: false }) isMutil: boolean;
  @Prop({ type: Array, default: null }) selectedList: any;
  @Prop({ type: Array, default: null }) unselectableList: any;
  @Prop({ type: Boolean, default: true }) unselectableStatus: boolean;

  curInitial: string = null;
  keyword: string = "";
  selected: any = null;

  innerQuery: any = null;

  get submitLabel() {
    if (!this.isMutil) return "确认";
    return `已选(${!isEmpty(this.selected) ? this.selected.length : 0})`;
  }

  created() {
    this.$bus.$on("picker:person:changed", (person, isChecked) => {
      if (this.isMutil) {
        this.selected = this.selected || [];
        this.selected = isChecked
          ? concat(this.selected, person)
          : pull(this.selected, person);
      } else {
        this.selected = isChecked ? person : null;
      }
    });
    this.resetInnerQuery();
  }

  @Watch("keyword")
  onKeywordChanged() {
    console.log(this.keyword);
    this.resetInnerQuery();
    console.log(this.innerQuery);
  }

  resetInnerQuery() {
    let q = cloneDeep(this.query || {});
    let f = JSON.parse(q.filters || "{}");
    if (!isEmpty(trim(this.keyword))) {
      f["realname"] = [trim(this.keyword)];
    }

    if (!isEmpty(f)) {
      q["filters"] = JSON.stringify(f);
    }
    q.merchant_id = this.$auth.user.curr_merch_id;
    this.innerQuery = q;
  }

  showInitial(item) {
    if (this.curInitial != item.initial) {
      this.curInitial = item.initial;
      return true;
    }
    return false;
  }

  checkSelected(item) {
    if (this.checkUnselectable(item)) {
      return this.unselectableStatus;
    }
    return this.selectedList && this.selectedList.indexOf(item.id) >= 0;
  }

  checkUnselectable(item) {
    return this.unselectableList && this.unselectableList.indexOf(item.id) >= 0;
  }

  onCancel() {
    this.selected = null;
    this.$emit("update:open", false);
  }

  onSubmit() {
    if (isEmpty(this.selected)) {
      this.$hui.toast.error("未选中任何对象");
      return;
    }
    this.$emit("selected", cloneDeep(this.selected));
  }
}
</script>
<style lang="scss" scoped></style>
