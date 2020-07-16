<template>
  <div class="wrapper">
    <ai-card @click.native="showPicker = true" class="add-video-entry">
      <template v-slot:header>
        <div class="cover">
          <i class="iconfont icon-plus" />
        </div>
      </template>
    </ai-card>
    <hui-popup v-model="showPicker" position="right" class="popup">
      <ai-video-selector @selected="onSelected" @cancel="showPicker = false" />
    </hui-popup>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Mixins } from "vue-property-decorator";

import SyncMixin from "@/mixin/SyncMixin";

import AiCard from "@/view/component/AiCard.vue";
import AiVideoSelector from "@/view/component/AiVideoSelector.vue";

import map from "lodash/map";
import isEmpty from "lodash/isEmpty";
import isEqual from "lodash/isEqual";

@Component({
  components: {
    AiCard,
    AiVideoSelector,
  },
})
export default class Home extends Mixins(SyncMixin) {
  @Prop({ type: Object, default: null }) merchant: any;

  showPicker: boolean = false;

  created() {
    this.store = "websiteVideo";
  }

  onSelected(video) {
    this.saveEntity({
      res: {
        video_id: video.id,
        merchant_id: this.$auth.user.curr_merch_id,
      },
      success: () => {
        this.showPicker = false;
      },
      failure: (err) => {
        let message = err.response.data.message;
        this.$hui.toast.info(
          isEqual(message, "资源冲突") ? "已经加入" : message
        );
      },
    });
  }
}
</script>
<style lang="scss" scoped>
.add-video-entry {
  width: 150px;
  height: 160px;
  padding: 5px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 8px 14px 0px rgba(0, 0, 0, 0.06);
  border-radius: 8px;

  margin-right: 15px;

  & ::v-deep .ai-card__header {
    height: 100%;
  }
  .cover {
    height: 95%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(216, 216, 216, 0.19);
    border-radius: 4px;
    i {
      color: rgba(195, 195, 195, 1);
    }
  }
}
.form {
  padding: 30px;
  text-align: center;

  & ::v-deep input {
    padding-left: 10px;
  }
}
.popup {
  & ::v-deep .h-popup__content {
    height: 100vh;
  }
}
</style>
