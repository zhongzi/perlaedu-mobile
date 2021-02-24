<template>
  <div class="wrapper add-album-entry" @click="onShowDialog">
    <template v-if="album">
      <i class="iconfont icon-editing" />
    </template>
    <div v-else class="cover">
      <i class="iconfont icon-plus" />
      <span> 新建相册</span>
    </div>
    <ai-dialog v-model="showDialog" :enableCloseIcon="false">
      <div class="form">
        <div class="title">{{ album ? "相册重命名" : "新建相册" }}</div>
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

import _get from "lodash/get";
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
  @Prop({ type: Object, default: null }) album: any;
  @Prop({ type: String, default: null }) outerTag: string;

  title: string = "";
  showDialog: boolean = false;

  created() {
    this.store = "mediaAlbum";
    this.title = _get(this.album, "title", "");
  }

  onShowDialog() {
    this.title = _get(this.album, "title", "");
    this.showDialog = true;
  }

  onCancel() {
    this.showDialog = false;
  }

  onSubmit() {
    if (isEmpty(this.title)) {
      this.$hui.toast.error("请输入相册名称");
      return;
    }
    this.id = _get(this.album, "id");
    const changes = {
      id: this.id,
      title: this.title,
    };
    this.saveEntity({
      res: changes,
      success: () => {
        if (this.album) {
          this.commitChanges(this.album.id, changes);
        }

        this.$bus.$emit("albums:refresh");
        this.$hui.toast.info("添加成功");
        this.showDialog = false;
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
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: rgba(216, 216, 216, 0.19);
    border-radius: 4px;
    color: rgba(195, 195, 195, 1);

    span {
      font-size: 14px;
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
