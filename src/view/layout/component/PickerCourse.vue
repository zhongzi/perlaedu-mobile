<template>
  <div class="wrapper picker-album">
    <ai-popup :value="open" @input="(v) => $emit('update:open', v)">
      <search v-model="keyword" />
      <check-list-stored
        resource="course"
        labelKey=""
        valueKey=""
        :query="innerQuery"
        :isMultiple="isMultiple"
        @cancel="onCancel"
        @submit="onSubmit"
      />
    </ai-popup>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";

import AiFixedFooter from "@/view/component/AiFixedFooter.vue";
import AiSubmitActions from "@/view/component/AiSubmitActions.vue";
import AiPopup from "@/view/component/AiPopup.vue";
import AiButtonRoundSmall from "@/view/component/AiButtonRoundSmall.vue";

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
    AiButtonRoundSmall,
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
    const q = cloneDeep(this.query || {});
    q.require_course_in_teaching = true;
    if (!isEmpty(this.keyword)) {
      q.keyword = this.keyword;
    }
    this.innerQuery = q;
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
<style lang="scss" scoped>
.picker-album {
}
</style>
