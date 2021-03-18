<template>
  <ai-list-stored
    class="wrapper notice-templates"
    resource="noticeTemplate"
    scrollType="slider"
    emptyText=""
    :limit="100"
    :query="query"
    :sliderOptions="{ slidesPerView: 5.5, spaceBetween: 5 }"
    :enableSlideBefore="enabledAll"
    :appendItems="initTemplate"
    @emit-list="setDefaultSelected"
  >
    <template v-slot:slide-before v-if="enabledAll">
      <ai-state-check-mask
        :checked="!value"
        :enableCancel="false"
        @update:checked="saveTemplate()"
      >
        <notice-template-cell :template="{ title: '全部' }" />
      </ai-state-check-mask>
    </template>
    <template v-slot:item="{ item }">
      <ai-state-check-mask
        :key="item.id"
        :checked="value && value.id === item.id"
        :enableCancel="false"
        @update:checked="saveTemplate(item)"
      >
        <notice-template-cell :template="item" />
      </ai-state-check-mask>
    </template>
  </ai-list-stored>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";

import AiCard from "@/view/component/AiCard.vue";
import AiListStored from "@/view/component/AiListStored.vue";
import AiStateCheckMask from "@/view/component/AiStateCheckMask.vue";

import NoticeTemplateCell from "./NoticeTemplateCell.vue";

import isEmpty from "lodash/isEmpty";
import cloneDeep from "lodash/cloneDeep";
import find from "lodash/find";

@Component({
  components: {
    AiCard,
    AiListStored,
    AiStateCheckMask,
    NoticeTemplateCell,
  },
})
export default class Home extends Vue {
  @Prop({ type: Object, default: null }) value: any;
  @Prop({ type: Boolean, default: false }) enabledAll: boolean;
  @Prop({ type: Boolean, default: false }) setFirstSelected: boolean;

  initable: boolean = true;
  initTemplate: any = null;
  templates: any = null;

  get code() {
    const code = this.$route.query.template;
    return isEmpty(code) ? null : code;
  }

  get query() {
    const query: any = {
      sort: "id asc",
    };
    if (this.initTemplate) {
      query.id = `!=${this.initTemplate.id}`;
    }
    return query;
  }

  created() {
    this.resetInitTemplate();
  }

  @Watch("value", { deep: true })
  onValueChanged() {
    this.resetInitTemplate();
  }

  resetInitTemplate() {
    if (!this.initable || !isEmpty(this.initTemplate)) return;

    if (this.code && !isEmpty(this.templates)) {
      this.initTemplate = cloneDeep(
        find(this.templates, (template) => template.code === this.code)
      );
      this.saveTemplate(this.initTemplate);
      return;
    }

    if (this.initable) {
      this.initTemplate = cloneDeep(this.value);
    }
  }

  setDefaultSelected({ list }) {
    this.templates = list;
    this.resetInitTemplate();

    if (!this.setFirstSelected) return;

    this.saveTemplate(this.templates[0]);
  }
  saveTemplate(template = null) {
    if (this.value === template || !this.initable) return;

    this.initable = false;
    this.$emit("input", template);
  }
}
</script>
<style lang="scss" scoped>
.notice-templates {
}
</style>
