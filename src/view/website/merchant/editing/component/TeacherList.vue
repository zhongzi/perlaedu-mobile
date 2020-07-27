<template>
  <ai-section class="wrapper editing-teachers" title="优秀老师">
    <ai-list-stored
      resource="websiteTeacher"
      :query="innerQuery"
      :refresh.sync="refresh"
      scrollType="slider"
      :enableEmpty="false"
      :sliderOptions="{ slidesPerView: 3.2, spaceBetween: 5 }"
      :enableSlideBefore="true"
      class="list"
    >
      <template v-slot:slide-before>
        <teacher-add-entry
          :merchant="merchant"
          @refresh="refresh = true"
          class="entry"
        />
      </template>
      <template v-slot:item="{ item, tag }">
        <ai-button-float-delete @delete="onDelete(item, tag)" class="item">
          <teacher :websiteTeacher="item" />
        </ai-button-float-delete>
      </template>
    </ai-list-stored>
  </ai-section>
</template>

<script lang="ts">
import { Component, Vue, Prop, Mixins } from "vue-property-decorator";

import SyncMixin from "@/mixin/SyncMixin";

import AiListStored from "@/view/component/AiListStored.vue";
import AiSection from "@/view/component/AiSection.vue";
import AiButtonFloatDelete from "@/view/component/AiButtonFloatDelete.vue";
import Teacher from "@/view/website/component/Teacher.vue";

import TeacherAddEntry from "./TeacherAddEntry.vue";

import merge from "lodash/merge";

@Component({
  components: {
    AiListStored,
    AiSection,
    AiButtonFloatDelete,
    Teacher,
    TeacherAddEntry,
  },
})
export default class Home extends Mixins(SyncMixin) {
  @Prop({ type: Object, default: null }) query: any;
  @Prop({ type: Object, default: null }) merchant: any;

  refresh: boolean = false;

  get innerQuery() {
    return merge(
      {
        merchant_id: this.merchant && this.merchant.id,
        extras: "teacher",
      },
      this.query || {}
    );
  }

  onDelete(websiteTeacher, tag) {
    this.store = "websiteTeacher";
    this.id = websiteTeacher.id;
    this.tag = tag;
    this.deleteEntity({
      res: { id: this.id },
      success: () => {
        this.$nextTick(() => {
          this.refresh = true;
        });
      },
    });
  }
}
</script>
<style lang="scss" scoped>
.editing-teachers {
  & ::v-deep .ai-section__body {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  & ::v-deep .ai-section__header {
    margin-left: 20px;
  }

  .entry {
    margin-left: 20px;
  }

  .list {
    overflow-x: scroll;
    flex: 1;
    .item:nth-child(1) {
      margin-left: 20px;
    }
  }
}
</style>
