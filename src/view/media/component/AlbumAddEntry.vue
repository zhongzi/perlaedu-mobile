<template>
  <div class="wrapper add-album-entry">
    <div @click="showDialog = true" class="cover">
      <i class="iconfont icon-plus" />
    </div>
    <ai-dialog v-model="showDialog" :enableCloseIcon="false">
      <div class="form">
        <div class="title">新建相册</div>
        <ai-input v-model="title" placeholder="输入相册名称" class="input" />
        <ai-submit-actions @submit="onSubmit" @cancel="onCancel" />
      </div>
    </ai-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Mixins } from "vue-property-decorator";

import SyncMixin from "@/mixin/SyncMixin";

import AiCard from "@/view/component/AiCard.vue";
import AiInput from "@/view/component/AiInput.vue";
import AiSubmitActions from "@/view/component/AiSubmitActions.vue";
import AiDialog from "@/view/component/AiDialog.vue";

import map from "lodash/map";
import isEmpty from "lodash/isEmpty";

@Component({
  components: {
    AiCard,
    AiInput,
    AiSubmitActions,
    AiDialog,
  },
})
export default class Home extends Mixins(SyncMixin) {
  title: string = "";
  showDialog: boolean = false;

  created() {
    this.store = "mediaAlbum";
  }

  onCancel() {
    this.showDialog = false;
  }

  onSubmit() {
    if (isEmpty(this.title)) {
      this.$hui.toast.error("请输入相册名称");
      return;
    }
    this.saveEntity({
      res: {
        title: this.title,
      },
      success: () => {
        this.$hui.toast.info("添加成功");
        this.$emit("refresh");
        this.showDialog = false;
        this.title = "";
      },
    });
  }
}
</script>
<style lang="scss" scoped>
.add-album-entry {
  .cover {
    width: 100%;
    height: 60px;
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
    padding: 30px 10px 10px;
  }

  .title {
    font-size: 16px;
  }
}
</style>
