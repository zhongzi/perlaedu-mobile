<template>
  <div class="wrapper course">
    <ai-image-uploader
      class="cover"
      v-model="innerCourse.cover"
      type="merchant"
      :prefix="merchantId + '/courses/' + innerCourse.id || ''"
      triggerName="course-cover"
    />
    <div class="fields">
      <ai-selection-stored
        class="field"
        resource="subject"
        label="选择科目"
        :query="query"
        @selected="onSelected"
        v-model="innerCourse.subject_id"
      />
      <ai-line />
      <ai-input class="field" label="课程名称" v-model="innerCourse.title" />
      <ai-line />
      <div class="custome-icon">
        <div class="label">课程图标</div>
        <img
          v-if="innerCourse.subject_icon"
          class="icon"
          :src="innerCourse.subject_icon"
          @click="openIconPicker = true"
        />
        <i v-else class="iconfont icon-upload" @click="openIconPicker = true" />
        <icon-picker
          :open.sync="openIconPicker"
          :prefix="merchantId + '/courses/' + innerCourse.id || ''"
          @selected="(v) => (innerCourse.subject_icon = v)"
        />
      </div>
      <ai-line />
      <!--
      <ai-selection-stored
        resource="billProject"
        label="购买链接"
        :query="query"
        :enableUnsetOption="true"
        v-model="innerCourse.bill_id"
      >
      </ai-selection-stored>
      <ai-line />
-->
      <ai-section class="field description">
        <template v-slot:header>
          <span> 详情 </span>
        </template>
        <ai-rich-text-sections-editor
          v-model="innerCourse.description"
          imageType="merchant"
          :isJson="false"
          :imagePrefix="merchantId + '/courses/' + innerCourse.id || ''"
        />
      </ai-section>
    </div>
    <ai-fixed-footer>
      <ai-submit-actions @submit="onSubmit" @cancel="$router.go(-1)" />
    </ai-fixed-footer>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Mixins, Watch } from "vue-property-decorator";

import SyncMixin from "@/mixin/SyncMixin";

import AiImageUploader from "@/view/component/AiImageUploader.vue";
import AiInput from "@/view/component/AiInput.vue";
import AiSubmitActions from "@/view/component/AiSubmitActions.vue";
import AiRichTextSectionsEditor from "@/view/component/AiRichTextSectionsEditor.vue";
import AiSelectionStored from "@/view/component/AiSelectionStored.vue";
import AiLine from "@/view/component/AiLine.vue";
import AiSection from "@/view/component/AiSection.vue";
import AiFixedFooter from "@/view/component/AiFixedFooter.vue";

import IconPicker from "./component/IconPicker.vue";

import isEqual from "lodash/isEqual";
import isEmpty from "lodash/isEmpty";
import _get from "lodash/get";
import merge from "lodash/merge";
import debounce from "lodash/debounce";
import cloneDeep from "lodash/cloneDeep";

@Component({
  components: {
    AiImageUploader,
    AiInput,
    AiSelectionStored,
    AiSubmitActions,
    AiRichTextSectionsEditor,
    AiLine,
    AiSection,
    AiFixedFooter,
    IconPicker,
  },
})
export default class Home extends Mixins(SyncMixin) {
  openIconPicker: boolean = false;
  innerCourse: any = {};

  get query() {
    return {};
  }

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
    this.innerCourse = {
      id: "",
      cover: "",
      title: "",
      description: "",
      bill_id: "",
      subject_id: "",
      subject_icon: "",
    };

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

  onSelected(subject) {
    if (isEmpty(this.innerCourse.title)) {
      this.innerCourse.title = subject && subject.title;
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
.course {
  padding-bottom: 50px;

  .fields {
    position: relative;
    top: -15px;
    background: #fff;
    border-radius: 12px 12px 0px 0px;

    padding-top: 17px;
    padding-left: 17px;
    padding-right: 17px;
  }
  .description {
    padding: 10px;
  }

  .custome-icon {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 7px 0px;

    .label {
      font-size: 3.73333vw;
      font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
      font-weight: bold;
      color: #545454;
      line-height: 5.06667vw;
      letter-spacing: 1px;
    }

    .icon {
      width: 40px;
      height: 40px;

      & ::v-deep .ai-image-uploader__result {
        min-height: auto;
        border-radius: 8px;
        overflow: hidden;
      }

      & ::v-deep .iconfont {
        font-size: 12px;
      }
    }
  }
}
</style>
