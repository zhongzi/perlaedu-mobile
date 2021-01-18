<template>
  <ai-popup
    class="wrapper icon-picker"
    :value="open"
    @input="(v) => $emit('update:open', v)"
  >
    <div class="body">
      <ai-cell
        class="section add"
        title="自定义上传"
        subtitle="可以直接上传自己icon，也可以在下面选择使用"
      >
        <template v-slot:right>
          <ai-image-uploader
            class="icon"
            triggerName="icon"
            v-model="selectedIcon"
            type="merchant"
            :resizeOption="{ width: 200, height: 200 }"
            :prefix="prefix"
          />
        </template>
      </ai-cell>
      <div class="icon-groups" v-sticky="'iconPicker'">
        <template v-for="group in groups">
          <icon-group
            :key="group.id"
            :group="group"
            :curIcon="selectedIcon"
            @selected="(v) => (selectedIcon = v.url)"
          />
        </template>
      </div>
      <ai-fixed-footer>
        <ai-submit-actions
          @cancel="$emit('update:open', false)"
          @submit="onSubmit"
        />
      </ai-fixed-footer>
    </div>
  </ai-popup>
</template>

<script lang="ts">
import { Component, Vue, Prop, Mixins, Watch } from "vue-property-decorator";

import SyncMixin from "@/mixin/SyncMixin";

import AiLine from "@/view/component/AiLine.vue";
import AiCell from "@/view/component/AiCell.vue";
import AiPopup from "@/view/component/AiPopup.vue";
import AiImageUploader from "@/view/component/AiImageUploader.vue";
import AiTab from "@/view/component/AiTab.vue";
import AiFixedFooter from "@/view/component/AiFixedFooter.vue";
import AiSubmitActions from "@/view/component/AiSubmitActions.vue";

import IconGroup from "./IconGroup.vue";

import _get from "lodash/get";
import merge from "lodash/merge";
import cloneDeep from "lodash/cloneDeep";

@Component({
  components: {
    AiLine,
    AiCell,
    AiPopup,
    AiImageUploader,
    AiTab,
    AiFixedFooter,
    AiSubmitActions,
    IconGroup,
  },
})
export default class Home extends Mixins(SyncMixin) {
  @Prop({ type: Boolean, default: false }) open: boolean;
  @Prop({ type: String, default: "null" }) prefix: string;

  selectedIcon: String = null;
  curTabIdx: number = 0;

  get groups() {
    return this.list;
  }
  get curGroup() {
    return this.groups[this.curTabIdx];
  }

  created() {
    this.store = "iconGroup";
    this.loadList({
      query: {
        limit: 100,
      },
    });
  }

  onSubmit() {
    this.$emit("selected", this.selectedIcon);
    this.$emit("update:open", false);
  }
}
</script>
<style lang="scss" scoped>
.icon-picker {
  .body {
    padding: 10px;
    .add {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin: 10px auto;

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
    .icon-groups {
      height: 80vh;
      overflow: scroll;
    }
  }
}
</style>
