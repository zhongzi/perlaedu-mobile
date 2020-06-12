<template>
  <div class="wrapper">
    <ai-image-uploader
      class="cover"
      v-model="innerCourse.cover"
      type="website"
      :prefix="'merchants/' + merchantId + '/courses'"
      triggerName="course-cover"
    />
    <div class="fields">
      <ai-input-borderless
        class="field"
        label="课程名称"
        v-model="innerCourse.title"
      />
      <ai-input-rich-text
        class="field"
        label="课程详情"
        v-model="innerCourse.description"
        type="website"
        imageType="merchant"
        :imagePrefix="'merchants/' + merchantId + '/courses'"
      />
      <ai-input-borderless
        class="field"
        label="购课链接"
        v-model="innerCourse.bill_url"
      />
      <ai-input-borderless
        class="field"
        label="归属科目"
        v-model="innerCourse.subject_name"
      />
    </div>
    <ai-submit-actions @submit="onSubmit" @cancel="$router.go(-1)" />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Mixins, Watch } from "vue-property-decorator";

import SyncMixin from "@/mixin/SyncMixin";

import AiImageUploader from "@/view/component/AiImageUploader.vue";
import AiInputBorderless from "@/view/component/AiInputBorderless.vue";
import AiSubmitActions from "@/view/component/AiSubmitActions.vue";
import AiInputRichText from "@/view/component/AiInputRichText.vue";

import isEqual from "lodash/isEqual";
import _get from "lodash/get";
import merge from "lodash/merge";
import debounce from "lodash/debounce";
import cloneDeep from "lodash/cloneDeep";

@Component({
  components: {
    AiImageUploader,
    AiInputBorderless,
    AiSubmitActions,
    AiInputRichText,
  },
})
export default class Home extends Mixins(SyncMixin) {
  innerCourse: any = {
    id: "",
    cover: "",
    title: "",
    description: "",
    bill_url: "",
    subject_name: "",
  };

  get course() {
    return this.entity;
  }

  get merchantId() {
    return parseInt(this.$route.params.merchantId);
  }

  get courseId() {
    return parseInt(this.$route.params.courseId);
  }

  created() {
    this.store = "course";
    this.load();
  }

  @Watch("course", { deep: true })
  onCourseChanged() {
    if (isEqual(this.course, this.innerCourse)) return;

    this.innerCourse = merge(this.innerCourse, this.course);
  }

  load() {
    if (this.courseId) {
      this.id = this.courseId;
      this.loadEntity();
    }
  }

  onSubmit() {
    if (!this.merchantId) return;

    this.id = this.course.id;
    this.saveEntity({
      res: cloneDeep(merge(this.innerCourse, { merchant_id: this.merchantId })),
      success: () => {
        this.$nextTick(() => {
          this.$router.go(-1);
        });
      },
    });
  }
}
</script>
<style lang="scss" scoped>
.wrapper {
  .fields {
    position: relative;
    top: -15px;
    background: #fff;
    border-radius: 12px 12px 0px 0px;

    padding-top: 17px;
    padding-left: 17px;
    padding-right: 17px;
  }
}
</style>
