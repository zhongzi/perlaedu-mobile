<template>
  <div class="wrapper teachers-picker">
    <!-- <ai-input v-model="keyword" placeholder="输入老师名称" /> -->
    <ai-list-stored
      resource="person"
      scrollType="scroll"
      :query="innerQuery"
      :enableEmpty="false"
    >
      <template v-slot:item-before>
        <div class="item" v-if="enableAddAction">
          <div class="plus" @click.stop="$emit('add')">
            <i class="iconfont icon-plus" />
          </div>
        </div>
      </template>
      <template v-slot:item="{ item }">
        <div class="item">
          <ai-state-check @update:checked="(v) => onCheckedChanged(item, v)">
            <teacher :teacher="item" routeName="" class="teacher" />
          </ai-state-check>
        </div>
      </template>
    </ai-list-stored>
    <ai-fixed-footer>
      <ai-submit-actions @cancel="onCancel" @submit="onSubmit" />
    </ai-fixed-footer>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Mixins } from "vue-property-decorator";

import SyncMixin from "@/mixin/SyncMixin";

import AiListStored from "@/view/component/AiListStored.vue";
import AiStateCheck from "@/view/component/AiStateCheck.vue";
import AiInput from "@/view/component/AiInput.vue";
import AiSubmitActions from "@/view/component/AiSubmitActions.vue";
import AiFixedFooter from "@/view/component/AiFixedFooter.vue";

import Teacher from "@/view/website/component/Teacher.vue";

import merge from "lodash/merge";
import filter from "lodash/filter";

@Component({
  components: {
    AiListStored,
    AiStateCheck,
    AiInput,
    AiSubmitActions,
    AiFixedFooter,
    Teacher,
  },
})
export default class Home extends Vue {
  @Prop({ type: Object, default: null }) query: any;
  @Prop({ type: Boolean, default: false }) enableAddAction: any;

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
  padding: 25px;

  & ::v-deep .ai-infinite-scroll__list {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
  }
  .item {
    width: 45%;
    margin: 10px 0px;

    .teacher {
      width: 100%;
      height: 100%;
      margin-bottom: 0px;
    }

    .plus {
      min-height: 180px;
      box-shadow: 0px 8px 14px 0px rgba(0, 0, 0, 0.06);

      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(216, 216, 216, 0.19);
      border-radius: 4px;
      i {
        color: rgba(195, 195, 195, 1);
      }
    }
  }
}
</style>
