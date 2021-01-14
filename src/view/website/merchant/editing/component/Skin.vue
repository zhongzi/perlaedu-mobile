<template>
  <div class="wrapper editing-skin" @click="showPicker = true">
    <ai-cell>
      <template v-slot:title>
        点击更换首页背景图
      </template>
      <template v-slot:subtitle>
        定制首页用户请慎重，不可回撤
      </template>
      <template v-slot:right>
        <div class="image-bg" :style="getMergedStyle(bgImage)" />
      </template>
    </ai-cell>
    <skin-image-picker
      :merchant="merchant"
      :show.sync="showPicker"
      @cancel="showPicker = false"
      @change="updateBGImage"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Mixins, Watch } from "vue-property-decorator";

import SyncMixin from "@/mixin/SyncMixin";

import AiCell from "@/view/component/AiCell.vue";
import AiImageUploader from "@/view/component/AiImageUploader.vue";

import SkinImagePicker from "./SkinImagePicker.vue";

import _get from "lodash/get";
import merge from "lodash/merge";
import cloneDeep from "lodash/cloneDeep";

@Component({
  components: {
    AiCell,
    AiImageUploader,
    SkinImagePicker,
  },
})
export default class Home extends Mixins(SyncMixin) {
  @Prop({ type: Object, default: null }) merchant: any;

  bgImage: String = null;
  showPicker: Boolean = false;

  get website() {
    return _get(this.merchant, "website", {});
  }

  created() {
    this.store = "website";
    this.resetBGImage();
  }

  @Watch("website", { deep: true })
  onWebsiteChanged() {
    this.resetBGImage();
  }

  resetBGImage() {
    this.bgImage = _get(this.website, "skin.resources.bgImage");
  }

  updateBGImage(url) {
    this.bgImage = url;
    this.saveWebsite();
    this.showPicker = false;
  }

  getMergedStyle(url) {
    return {
      backgroundImage: `url('${url}')`,
      backgroundPosition: "0 0",
      backgroundRepeat: "repeat",
    };
  }

  saveWebsite() {
    if (!this.website.id) return;

    this.id = this.website.id;
    let skin = cloneDeep(this.website.skin || {});
    skin.resources = skin.resources || {};
    skin.resources = merge(skin.resources || {}, {
      bgImage: this.bgImage,
    });
    skin.home = {
      backgroundImage: `url('${this.bgImage}')`,
      backgroundPosition: "0 0",
      backgroundRepeat: "repeat",
      backgroundSize: "100%",
    };
    this.saveEntity({
      res: {
        id: this.id,
        skin: skin,
      },
    });
  }
}
</script>
<style lang="scss" scoped>
.editing-skin {
  margin: 10px 20px;
  .image-bg {
    width: 60px;
    height: 60px;
    background: #f5f5f5;
  }
}
</style>
