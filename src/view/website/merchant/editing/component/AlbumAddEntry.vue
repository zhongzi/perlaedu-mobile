<template>
  <div class="wrapper add-album-entry">
    <ai-card @click.native="showDialog = true">
      <template v-slot:header>
        <div class="cover">
          <i class="iconfont icon-plus" />
        </div>
      </template>
    </ai-card>
    <hui-dialog v-model="showDialog" :appendToBody="true">
      <div class="form">
        <h2>新建相册</h2>
        <ai-input v-model="title" placeholder="输入相册名称" class="input" />
        <ai-submit-actions @submit="onSubmit" @cancel="onCancel" />
      </div>
    </hui-dialog>
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

  title: string = "";
  showDialog: boolean = false;

  created() {
    this.store = "album";
  }

  onCancel() {
    this.showDialog = false;
  }

  onSubmit(teachers) {
    if (isEmpty(this.title)) {
      this.$hui.toast.error("请输入相册名称");
      return;
    }
    this.saveEntity({
      res: {
        merchant_id: this.merchant && this.merchant.id,
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
  margin: 10px 0px;
  width: 194px;
  height: 148px;

  padding: 5px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 8px 14px 0px rgba(0, 0, 0, 0.06);
  border-radius: 8px;
  box-sizing: border-box;

  margin-right: 12px;

  & ::v-deep .ai-card__header {
    height: 100%;
  }
  .cover {
    width: 100%;
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
    padding: 30px 10px 10px;
  }
}
</style>
