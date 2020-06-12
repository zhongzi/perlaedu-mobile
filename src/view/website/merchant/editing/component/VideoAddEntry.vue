<template>
  <div class="wrapper">
    <ai-card @click.native="onClick" class="add-video-entry">
      <template v-slot:header>
        <div class="cover">
          <i class="iconfont icon-plus" />
        </div>
      </template>
    </ai-card>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Mixins } from "vue-property-decorator";

import SyncMixin from "@/mixin/SyncMixin";

import AiCard from "@/view/component/AiCard.vue";
import AiInput from "@/view/component/AiInput.vue";
import AiSubmitActions from "@/view/component/AiSubmitActions.vue";

import map from "lodash/map";
import isEmpty from "lodash/isEmpty";

@Component({
  components: {
    AiCard,
    AiInput,
    AiSubmitActions,
  },
})
export default class Home extends Mixins(SyncMixin) {
  @Prop({ type: Object, default: null }) merchant: any;

  onClick() {
    this.$router.push({
      name: "websiteEditingVideo",
      params: {
        videoId: "new",
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
</style>
