<template>
  <div :class="b()">
    <div :class="b('trigger')" @click="openPicker = true">
      <i class="iconfont icon-plus" />
    </div>
    <ai-popup v-model="openPicker" v-if="limit > 0">
      <ai-video-picker
        :limit="limit"
        @input:media="addMedia"
        @trigger="trigger"
        @cancel="openPicker = false"
      />
    </ai-popup>
    <ai-video-ali-uploader-new
      v-show="limit > 0"
      ref="uploader"
      :class="b('media')"
      :kind="kind"
      :limit="limit"
      :merchantId="merchantId"
      @input:media="addMedia"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

import AiPopup from "./AiPopup.vue";
import AiVideoPicker from "./AiVideoPicker.vue";
import AiVideoAliUploaderNew from "./AiVideoAliUploaderNew.vue";

import _get from "lodash/get";

@Component({
  name: "ai-video-picker-popup",
  components: {
    AiPopup,
    AiVideoPicker,
    AiVideoAliUploaderNew,
  },
})
export default class Home extends Vue {
  @Prop({ type: String, default: "" }) kind: string;
  @Prop({ type: Number, default: 3 }) limit: number;
  @Prop({ type: [String, Number], default: 0 }) merchantId: string | number;

  openPicker: boolean = false;

  addMedia(media) {
    this.openPicker = false;
    this.$emit("input:media", media);
  }

  trigger() {
    const file = _get(this, "$refs.uploader.$refs.uploader.$refs.file") as any;
    file.click();

    this.openPicker = false;
  }
}
</script>
<style lang="scss" scoped>
.ai-video-picker-popup {
  & ::v-deep .ai-input-file__show {
    display: none;
  }

  &__trigger {
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;

    color: #fff;
  }
}
</style>
