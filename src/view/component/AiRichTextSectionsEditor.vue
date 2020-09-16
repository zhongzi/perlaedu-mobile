<template>
  <div :class="b()">
    <div
      v-for="(item, i) in details"
      :key="i"
      :class="b('container', { editing: isEditing })"
    >
      <div :class="{ border: isEditing }">
        <div :class="b('title')">
          <template v-if="isEditing">
            <ai-input v-model="item.title" placeholder="填写章节标题(选填)" />
          </template>
          <template v-else-if="item.title">
            <div class="content">
              {{ item.title }}
            </div>
          </template>
        </div>
        <div :class="b('content')">
          <div
            v-for="(c, j) in item.content"
            :key="j"
            :class="b('content-item')"
          >
            <div v-if="c.type === 'txt'" :class="c.type">
              <template v-if="isEditing">
                <ai-rich-text-quill-editor v-model="c.desc" />
              </template>
              <template v-else>
                <ai-rich-text-quill-editor
                  :is-editing="false"
                  :value="c.desc"
                />
              </template>
            </div>
            <div v-if="c.type === 'img'" :class="c.type">
              <template v-if="isEditing">
                <ai-image-uploader
                  v-model="c.url"
                  :prefix="imagePrefix"
                  :triggerName="i.toString() + '-' + j.toString()"
                  :type="imageType"
                  :flag="false"
                />
              </template>
              <template v-else>
                <img :src="c.url" @click="previewImage(c.url, imgUrls)" />
              </template>
            </div>
            <div v-if="c.type === 'video'" :class="c.type">
              <template v-if="c.videoId">
                <ai-video-ali-player
                  :video-id="c.videoId"
                  :autoplay="false"
                  :showInfo="false"
                />
              </template>
              <template v-else-if="isEditing">
                <div @click="uploadVideo(c)" class="video-uploader">
                  <i
                    class="iconfont icon-video"
                    style="font-size: 72px; color: #fff;"
                  />
                </div>
              </template>
            </div>
            <i
              v-if="isEditing && item.content.length > 1"
              class="iconfont icon-close"
              @click.stop="onDelContent(item, j)"
            />
            <i
              v-if="
                isEditing &&
                item.content.length > 1 &&
                j < item.content.length - 1
              "
              class="iconfont icon-sequence"
              @click.stop="downGo(item.content, j)"
            />
          </div>
          <div v-if="isEditing" :class="b('content-add')">
            <div class="btn" @click.stop="onAddContent(item, 'txt')">
              <i class="iconfont icon-text-insert" />
            </div>
            <div class="btn" @click.stop="onAddContent(item, 'img')">
              <i class="iconfont icon-photo-add" />
            </div>
            <div class="btn" @click.stop="onAddContent(item, 'video')">
              <i class="iconfont icon-video" style="font-size: 34px;" />
            </div>
            <div class="btn" @click.stop="onDelDetail(i)">
              <i class="iconfont icon-trash" />
            </div>
          </div>
        </div>
      </div>
      <div :class="b('sequence')">
        <i
          v-if="isEditing && details.length > 1 && i < details.length - 1"
          class="iconfont icon-sequence"
          @click.stop="downGo(details, i)"
        />
      </div>
    </div>
    <div v-if="isEditing" :class="b('btn-add')">
      <button @click="onAddDetail">
        <i class="iconfont icon-plus" />
        添加模块
      </button>
    </div>
    <ai-popup v-model="showPicker" position="right">
      <ai-video-selector
        @selected="onSelected"
        @cancel="showPicker = false"
        :class="b('video-selector')"
        :multiple="false"
      />
    </ai-popup>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";

import AiRichTextQuillEditor from "./AiRichTextQuillEditor.vue";
import AiImageUploader from "./AiImageUploader.vue";
import AiVideoSelector from "./AiVideoSelector.vue";
import AiVideoAliPlayer from "./AiVideoAliPlayer.vue";
import AiInput from "./AiInput.vue";
import AiPopup from "./AiPopup.vue";

import cloneDeep from "lodash/cloneDeep";
import isString from "lodash/isString";

import "quill/dist/quill.core.css";

@Component({
  name: "ai-rich-text-sections-editor",
  components: {
    AiRichTextQuillEditor,
    AiImageUploader,
    AiVideoSelector,
    AiVideoAliPlayer,
    AiInput,
    AiPopup,
  },
})
export default class Home extends Vue {
  @Prop([Array, String]) value: Array<Object> | String;
  @Prop({ type: Boolean, default: true }) isEditing: Boolean;
  @Prop({ type: Boolean, default: false }) isJson: Boolean;
  @Prop({ type: String, default: "" }) imageType: string;
  @Prop({ type: String, default: "" }) imagePrefix: string;

  details: Array<any> = [];
  curNode: any = null;
  showPicker: boolean = false;

  get imgUrls() {
    let urls = [];
    if (this.details.length > 0) {
      this.details.map((d) => {
        d.content.map((c) => {
          if (c.type === "img") {
            c.url && urls.push(c.url);
          }
        });
      });
      return urls;
    }
  }

  @Watch("value")
  onValueChanged(val: any) {
    this.details = this.detailToArray(val);
  }

  @Watch("details", { deep: true })
  onDetailsChanged(val: any) {
    let data = val;
    if (!this.isJson) {
      data = val.length > 0 ? JSON.stringify(val) : "";
    }
    this.$emit("input", data);
  }

  created() {
    this.details = this.detailToArray(this.value);
  }

  detailToArray(val) {
    let ret = val || [];
    if (!this.isJson) {
      ret = JSON.parse(val || "[]");
    }
    return ret;
  }

  onAddDetail() {
    const detail = {
      content: [
        {
          type: "txt",
          desc: "",
          url: "",
        },
      ],
      title: "",
    };
    this.details.push(detail);
  }

  onDelDetail(i) {
    this.$hui.confirm.show({
      title: "删除确认",
      message: `确定删除当前编辑模块`,
      confirmText: "确认",
      cancelText: "取消",
      onConfirm: () => {
        this.details.splice(i, 1);
      },
    });
  }

  onAddContent(val, type) {
    let c = {
      type: type,
      desc: "",
      url: "",
      videoId: "",
    };
    val.content.push(c);
    this.$forceUpdate();
  }

  onDelContent(val, i) {
    if (val.content.length > 0) {
      val.content.splice(i, 1);
      this.$forceUpdate();
    }
  }

  uploadVideo(c) {
    this.curNode = c;
    this.showPicker = true;
  }

  onSelected(video) {
    if (!this.curNode || this.curNode.type !== "video") {
      return;
    }
    this.curNode.videoId = video.id;
    this.curNode = null;
    this.showPicker = false;
  }

  downGo(val, index) {
    if (index != val.length - 1) {
      val[index] = val.splice(index + 1, 1, val[index])[0];
    } else {
      val.unshift(val.splice(index, 1)[0]);
    }
  }

  previewImage(current, urls) {
    if (!current || !urls || urls.length <= 0) {
      return;
    }
    this.$weixin.config(() => {
      this.$weixin.jsapi.previewImage({
        current: current,
        urls: urls,
      });
    });
  }
}
</script>

<style lang="scss">
.ai-rich-text-sections-editor {
  margin-bottom: 70px;

  &__container {
    width: 100%;

    .border {
      border: 1px dashed #000;
      padding: 10px 5px;
    }

    &:not(:last-child) {
      margin-bottom: 15px;
    }

    &_editing {
      input,
      textarea {
        width: 100%;
        border: 1px dashed #fff;
        background: transparent;
        // color: #fff;
      }

      .img {
        line-height: 0;

        .content {
          min-height: 160px;
        }
      }

      img {
        border: 1px dashed #fff;
      }

      .ql-editor {
        min-height: 70px;
      }
    }

    .icon-sequence {
      border-radius: 50%;
      font-size: 20px;
      padding: 5px;
      width: 30px;
      height: 30px;
      text-align: center;
      line-height: 40px;
      opacity: 0.6;
      border: 1px dashed #000;
    }
  }

  &__title {
    font-size: 20px;
    font-weight: 500;
    text-align: center;

    input {
      font-size: 20px;
      width: 181px;
      text-align: center;
    }

    .content {
      margin-top: 25px;
    }
  }

  &__content {
    border-radius: 10px;

    &-item {
      position: relative;

      &:not(:last-child) {
        margin-bottom: 10px;
      }

      .txt {
        border-radius: 10px;

        .ql-toolbar {
          background: #fff;
        }

        .ql-container {
          height: auto;
        }
      }

      .img {
        line-height: 0;

        img {
          width: 100%;
        }
      }

      .video {
        margin: 5px 0px;
      }
      .video-uploader {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        min-height: 200px;
        background: rgba(0, 0, 0, 0.4);
      }

      .icon-close {
        position: absolute;
        top: -6px;
        right: -6px;
        border-radius: 50%;
        width: 23px;
        height: 23px;
        background: rgba(92, 92, 95, 0.5);
        text-align: center;
        line-height: 25px;
        opacity: 0.6;
        font-size: 14px;
        z-index: 199;
      }
    }

    &-add {
      background: #fff;
      border-radius: 0 0 10px 10px;
      margin-top: 10px;
      display: flex;
      justify-content: space-around;
      color: #000;

      .btn {
        display: flex;
        align-items: center;
      }

      i {
        font-size: 25px;
        margin-right: 6px;
      }
    }
  }

  &__sequence {
    text-align: center;
    margin: 10px auto;
  }

  &__btn-add {
    text-align: center;

    button {
      background: #f4a721;
      border-radius: 5px;
      color: #fff;
      font-size: 16px;
      font-weight: 500;
      width: 140px;
      line-height: 2;
      border: none;
    }
  }

  &__video-selector {
    min-height: 100vh;
  }
}
</style>
