<template>
  <div class="wrapper picker-person">
    <ai-popup :value="open" @input="(v) => $emit('update:open', v)">
      <search v-model="keyword" />
      <check-list-stored
        resource="person"
        :query="innerQuery"
        :isMultiple="isMultiple"
        @cancel="onCancel"
        @submit="onSubmit"
      >
        <template v-slot:item="{ item }">
          <div class="cont">
            <picker-person-cell :person="item" />
          </div>
        </template>
      </check-list-stored>
    </ai-popup>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";

import AiFixedFooter from "@/view/component/AiFixedFooter.vue";
import AiSubmitActions from "@/view/component/AiSubmitActions.vue";
import AiPopup from "@/view/component/AiPopup.vue";

import Search from "./Search.vue";
import PickerPersonCell from "./PickerPersonCell.vue";
import CheckListStored from "./CheckListStored.vue";

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
    CheckListStored,
    Search,
    PickerPersonCell,
  },
})
export default class Home extends Vue {
  @Prop({ type: Boolean, default: false }) open: boolean;
  @Prop({ type: Object, default: null }) query: any;
  @Prop({ type: Boolean, default: true }) isMultiple: boolean;
  @Prop({ type: Array, default: null }) selectedList: any;

  curInitial: string = null;
  keyword: string = "";

  innerQuery: any = null;

  created() {
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

  onCancel() {
    this.$emit("update:open", false);
  }

  onSubmit(selected) {
    if (isEmpty(selected)) {
      this.$hui.toast.error("未选中任何对象");
      return;
    }
    this.$emit("selected", cloneDeep(selected));
  }
}
</script>
<style lang="scss" scoped></style>
