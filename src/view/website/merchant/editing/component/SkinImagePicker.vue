<template>
  <ai-dialog :value="show" @input="(v) => $emit('update:show', v)">
    <div class="wrapper editing-skin-image-bg">
      <div class="images">
        <template v-for="style in styles">
          <ai-state-check
            @update:checked="(v) => onCheckedChanged(style, v)"
            :checked="style.url === url"
            :key="style.id"
          >
            <div :style="getMergedStyle(style.url)" class="image"></div>
          </ai-state-check>
        </template>
      </div>
      <ai-line />
      <ai-cell class="custome-image">
        <template v-slot:title>
          自定义背景图
        </template>
        <template v-slot:subtitle>
          备注: 宽度 > 750px
        </template>
        <template v-slot:right>
          <ai-image-uploader
            class="icon"
            triggerName="icon"
            type="merchant"
            v-model="url"
            :resizeOption="{}"
            :prefix="merchant.id"
          />
        </template>
      </ai-cell>
      <ai-submit-actions @submit="submit" @cancel="cancel" />
    </div>
  </ai-dialog>
</template>

<script lang="ts">
import { Component, Vue, Prop, Mixins, Watch } from "vue-property-decorator";

import SyncMixin from "@/mixin/SyncMixin";

import AiCell from "@/view/component/AiCell.vue";
import AiLine from "@/view/component/AiLine.vue";
import AiDialog from "@/view/component/AiDialog.vue";
import AiStateCheck from "@/view/component/AiStateCheck.vue";
import AiImageUploader from "@/view/component/AiImageUploader.vue";
import AiSubmitActions from "@/view/component/AiSubmitActions.vue";

import _get from "lodash/get";
import merge from "lodash/merge";

@Component({
  components: {
    AiCell,
    AiLine,
    AiDialog,
    AiStateCheck,
    AiImageUploader,
    AiSubmitActions,
  },
})
export default class Home extends Mixins(SyncMixin) {
  @Prop({ type: Object, default: null }) merchant: any;
  @Prop({ type: Boolean, default: false }) show: boolean;

  url: String = null;

  get styles() {
    return this.list;
  }

  created() {
    this.store = "websiteStyle";
    this.loadList();
  }

  onCheckedChanged(style, flag) {
    this.url = flag ? style.url : null;
  }

  getMergedStyle(url) {
    return {
      backgroundImage: `url('${url}')`,
      backgroundPosition: "0 0",
      backgroundRepeat: "repeat",
    };
  }

  submit() {
    this.$emit("change", this.url);
  }

  cancel() {
    this.$emit("cancel");
  }
}
</script>
<style lang="scss" scoped>
.editing-skin-image-bg {
  margin: 20px;
  .images {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;

    .image {
      width: 60px;
      height: 60px;
    }
  }
  .custome-image {
    margin: 20px auto;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .icon {
      overflow: hidden;
      width: 60px;
      height: 60px;

      & ::v-deep .ai-image-uploader__result-icon {
        width: 60px;
        height: 60px;
      }

      & ::v-deep i {
        font-size: 24px;
      }
    }
  }
}
</style>
