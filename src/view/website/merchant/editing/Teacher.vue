<template>
  <div class="wrapper">
    <ai-image-uploader
      class="cover"
      v-model="innerTeacher.cover_url"
      type="merchant"
      :prefix="merchantId + '/teachers/' + innerTeacher.id || ''"
      :resizeOption="{ width: 180, height: 240 }"
      triggerName="teacher-cover"
    />
    <div class="fields">
      <ai-input class="field" label="姓名" v-model="innerTeacher.realname" />
      <ai-line />
      <ai-input class="field" label="手机号码" v-model="innerTeacher.phone" />
      <ai-line />
      <ai-section class="field description">
        <template v-slot:header>
          <span> 详情 </span>
        </template>
        <ai-rich-text-sections-editor
          v-model="innerTeacher.sections"
          imageType="merchant"
          :isJson="true"
          :imagePrefix="merchantId + '/teachers/' + innerTeacher.id || ''"
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

import { PersonRole } from "@/enum/person_role";

import isEqual from "lodash/isEqual";
import isEmpty from "lodash/isEmpty";
import _get from "lodash/get";
import merge from "lodash/merge";
import debounce from "lodash/debounce";
import cloneDeep from "lodash/cloneDeep";

const defaultPhone = "18800000000";

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
  },
})
export default class Home extends Mixins(SyncMixin) {
  innerTeacher: any = {
    id: null,
    cover_url: "",
    realname: "",
    phone: "",
    sections: [],
  };

  get teacher() {
    return this.entity;
  }

  get merchantId() {
    return parseInt(this.$route.params.merchantId);
  }

  get teacherId() {
    return parseInt(this.$route.params.teacherId);
  }

  created() {
    this.store = "person";
    this.load();
  }

  @Watch("teacher", { deep: true })
  onTeacherChanged() {
    if (isEqual(this.teacher, this.innerTeacher)) return;

    this.innerTeacher = cloneDeep(merge(this.innerTeacher, this.teacher));
    if (this.isDefaultPhone(this.innerTeacher)) {
      this.innerTeacher.phone = "";
    }
  }

  load() {
    if (this.teacherId) {
      this.id = this.teacherId;
      this.loadEntity({
        query: {
          extras: "sections,phone",
        },
      });
    }
  }

  isDefaultPhone(person) {
    return isEqual(_get(person, "phone"), defaultPhone);
  }

  onSubmit() {
    if (!this.merchantId) return;

    const person = cloneDeep(
      merge(this.innerTeacher, {
        merchant_id: this.merchantId,
      })
    );

    if (isEmpty(person.phone)) {
      person.phone = defaultPhone;
    }

    if (!this.$tools.regxs.telephone(person.phone)) {
      this.$hui.toast.error("请输入正确的手机号码");
      return;
    }

    this.id = person.id;
    if (!this.id) {
      person.role = PersonRole.teacher.value;
    }

    this.saveEntity({
      res: person,
      query: {
        website_teacher_required: true,
      },
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
  .description {
    padding: 10px;
  }
}
</style>
