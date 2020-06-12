<template>
  <div class="wrapper teachers-picker">
    <ai-input-borderless v-model="keyword" placeholder="输入老师名称" />
    <ai-list-stored
      resource="person"
      scrollType="scroll"
      :query="innerQuery"
      :enableEmpty="false"
    >
      <template v-slot:item="{ item }">
        <ai-state-check
          @update:checked="(v) => onCheckedChanged(item, v)"
          class="item"
        >
          <teacher :teacher="item" :enablePreview="false" />
        </ai-state-check>
      </template>
    </ai-list-stored>
    <ai-submit-actions @cancel="onCancel" @submit="onSubmit" />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

import SyncMixin from "@/mixin/SyncMixin";

import AiListStored from "@/view/component/AiListStored.vue";
import AiStateCheck from "@/view/component/AiStateCheck.vue";
import AiInputBorderless from "@/view/component/AiInputBorderless.vue";
import AiSubmitActions from "@/view/component/AiSubmitActions.vue";
import AiFixedFooter from "@/view/component/AiFixedFooter.vue";

import Teacher from "@/view/website/component/Teacher.vue";

import merge from "lodash/merge";
import filter from "lodash/filter";

@Component({
  components: {
    AiListStored,
    AiStateCheck,
    AiInputBorderless,
    AiSubmitActions,
    AiFixedFooter,
    Teacher,
  },
})
export default class Home extends Vue {
  @Prop({ type: Object, default: null }) query: any;

  keyword: string = "";
  selectedTeachers: any = [];

  get innerQuery() {
    return merge(
      {
        role: ">=8",
        filters: JSON.stringify({
          realname: [this.keyword],
        }),
      },
      this.query || {}
    );
  }

  onCheckedChanged(teacher, checked) {
    if (!checked) {
      this.selectedTeachers = filter(
        this.selectedTeachers,
        (t) => !(t.id !== teacher.id)
      );
    } else {
      this.selectedTeachers.push(teacher);
    }
  }

  onCancel() {
    this.$emit("cancel");
  }

  onSubmit() {
    this.$emit("submit", this.selectedTeachers);
  }
}
</script>
<style lang="scss" scoped>
.teachers-picker {
  padding: 15px;

  & ::v-deep .ai-list-stored__list {
    display: flex;
    align-items: center;
  }
  .item {
    width: 40%;
  }
}
</style>
