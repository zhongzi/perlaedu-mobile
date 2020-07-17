<template>
  <div :class="b()">
    <div :class="b('editor')">
      <div class="insert">
        <i class="iconfont icon-text-insert" @click="insertText(0)" />
        <i class="iconfont icon-photo-add" @click="insertImage(0)" />
      </div>
      <div :class="b('content')">
        <div v-for="(s, idx) in sections" :key="getUniqueId(s)">
          <div class="section-content" v-if="s.url || s.text">
            <img class="section-image" v-if="s.url" :src="s.url" />
            <div v-else>
              <pre
                v-bind:style="
                  richTextStyle(s.font_size, s.font_weight, s.font_color)
                "
                >{{ s.text }}</pre
              >
            </div>
            <div class="section-actions">
              <div class="edit">
                <i
                  v-if="s.text"
                  class="iconfont icon-text-insert"
                  @click="editSection(idx)"
                ></i>
                <i class="iconfont icon-trash" @click="removeSection(idx)"></i>
              </div>
              <div class="insert">
                <i
                  class="iconfont icon-text-insert"
                  @click="insertText(idx + 1)"
                />
                <i
                  class="iconfont icon-photo-add"
                  @click="insertImage(idx + 1)"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <ai-rich-text-text-unit
      v-if="showTextEditor"
      :value="selectedRichText"
      @input="saveRichText"
      @close="showTextEditor = false"
    />
    <ai-image-uploader
      ref="uploader"
      @input="(img) => saveImage({ url: img })"
      :prefix="imagePrefix"
      :type="imageType"
    >
      <span />
    </ai-image-uploader>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";

import AiImageUploader from "./AiImageUploader.vue";
import AiRichTextTextUnit from "./AiRichTextTextUnit.vue";

import cloneDeep from "lodash/cloneDeep";
import uniqueId from "lodash/uniqueId";
import isString from "lodash/isString";
import isEmpty from "lodash/isEmpty";
import isObject from "lodash/isObject";

@Component({
  name: "ai-rich-text-editor",
  components: {
    AiRichTextTextUnit,
    AiImageUploader,
  },
})
export default class Home extends Vue {
  @Prop({ type: [String, Array], default: null }) value: any;
  @Prop({ type: String, default: null }) imageType: string;
  @Prop({ type: String, default: null }) imagePrefix: string;

  sections: any = [{}];
  currentIndex: number = 0;
  selectedRichText: any = {};
  showTextEditor: boolean = false;
  isNew = true;

  created() {
    this.resetSections();
    this.resetSelectedRichText();
  }

  @Watch("value", { deep: true })
  onValueChanged() {
    this.resetSections();
  }

  resetSections() {
    if (isEmpty(this.value)) return;
    if (isString(this.value)) {
      try {
        this.sections = JSON.parse(this.value);
        this.sections = this.sections.length > 0 ? this.sections : [{}];
      } catch (e) {
        console.log(e);
      }
    } else {
      this.sections = cloneDeep(this.value);
    }
    return;
  }

  resetSelectedRichText() {
    this.selectedRichText = {
      font_size: "15px",
      font_weight: "normal",
      font_color: "black",
    };
    this.$emit("input", JSON.stringify(this.sections));
  }

  richTextStyle(fontSize, fontWeight, fontColor) {
    return {
      "font-size": fontSize || "15px",
      "font-weight": fontWeight || "normal",
      color: fontColor || "black",
    };
  }

  getUniqueId(s) {
    return JSON.stringify(s);
  }

  saveRichText(value) {
    if (!this.isNew) {
      this.sections[this.currentIndex] = value;
    } else {
      this.sections.splice(this.currentIndex, 0, { ...value });
    }
    this.resetSelectedRichText();
    this.showTextEditor = false;
  }

  saveImage(value) {
    this.sections.splice(this.currentIndex, 0, { ...value });
    this.resetSelectedRichText();
  }

  insertImage(index) {
    this.currentIndex = index;

    let uploader = this.$refs.uploader as any;
    uploader.trigger();
  }

  insertText(index) {
    this.isNew = true;
    this.currentIndex = index;
    this.showTextEditor = true;
  }

  editSection(index) {
    this.isNew = false;
    this.currentIndex = index;
    this.selectedRichText = this.sections[index];
    this.showTextEditor = true;
  }

  removeSection(index) {
    this.sections.splice(index, 1);
    this.resetSelectedRichText();
  }
}
</script>
<style lang="scss" scoped>
.ai-rich-text-editor {
  &__editor {
    min-height: 300px;
    background: rgba(237, 237, 237, 1);
    margin: 10px 0px;
    padding: 10px 10px;
  }

  &__content {
    min-height: 250px;
    max-height: 500px;
    overflow-y: scroll;
  }

  .insert {
    width: 79px;
    background: rgba(237, 237, 237, 1);
    border-radius: 6px;
    display: flex;
    align-item: center;
    justify-content: space-between;
    padding: 5px 10px;
  }

  .edit {
    background: rgba(237, 237, 237, 1);
    border-radius: 6px;
    display: flex;
    align-item: center;
    justify-content: space-between;
    padding: 5px 10px;

    i:nth-child(2) {
      margin-left: 30px;
    }
  }

  .section-content {
    padding: 5px;
    margin: 5px;

    background: rgba(247, 247, 247, 1);
    border-radius: 6px;

    pre {
      word-break: break-word;
      white-space: pre-wrap;
    }

    .section-image {
      width: 100%;
      vertical-align: bottom;
    }
    .section-actions {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px;
    }
  }
}
</style>
