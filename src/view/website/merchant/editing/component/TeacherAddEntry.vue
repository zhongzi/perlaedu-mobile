<template>
  <div class="wrapper add-teacher-entry">
    <ai-card @click.native="showPicker = true">
      <template v-slot:header>
        <div class="cover">
          <i class="iconfont icon-plus" />
        </div>
      </template>
      <template v-slot:body> </template>
    </ai-card>
    <hui-popup v-model="showPicker" position="right">
      <div class="popup" v-if="showPicker">
        <teacher-picker :query="query" @submit="onSubmit" @cancel="onCancel" />
      </div>
    </hui-popup>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Mixins } from "vue-property-decorator";

import SyncMixin from "@/mixin/SyncMixin";

import AiCard from "@/view/component/AiCard.vue";

import TeacherPicker from "./TeacherPicker.vue";

import map from "lodash/map";

@Component({
  components: {
    AiCard,
    TeacherPicker,
  },
})
export default class Home extends Mixins(SyncMixin) {
  @Prop({ type: Object, default: null }) merchant: any;

  showPicker: boolean = false;

  get query() {
    return {
      merchant_id: this.merchant && this.merchant.id,
      website_unjoined: true,
    };
  }

  created() {
    this.store = "websiteTeacher";
  }

  onCancel() {
    this.showPicker = false;
  }

  onSubmit(teachers) {
    if (teachers.length < 1) {
      this.$hui.toast.info("您未选择任何老师信息");
      return;
    }
    this.saveEntity({
      res: map(teachers, (t) => {
        return {
          merchant_id: this.merchant && this.merchant.id,
          teacher_id: t.id,
        };
      }),
      success: () => {
        this.$hui.toast.info("添加成功");
        this.$emit("refresh");
        this.showPicker = false;
      },
    });
  }
}
</script>
<style lang="scss" scoped>
.add-teacher-entry {
  min-width: 104px;
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
.popup {
  height: 100vh;
}
</style>
