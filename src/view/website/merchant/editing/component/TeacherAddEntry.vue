<template>
  <div class="wrapper">
    <ai-card @click.native="showPicker = true" class="add-teacher-entry">
      <template v-slot:header>
        <div class="cover">
          <i class="iconfont icon-plus" />
        </div>
      </template>
      <template v-slot:body> </template>
    </ai-card>
    <ai-popup v-model="showPicker">
      <teacher-picker
        :query="query"
        @submit="onSubmit"
        @cancel="onCancel"
        class="popup"
        @add="addTeacher"
        :enableAddAction="true"
      />
    </ai-popup>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Mixins } from "vue-property-decorator";

import SyncMixin from "@/mixin/SyncMixin";

import AiCard from "@/view/component/AiCard.vue";
import AiPopup from "@/view/component/AiPopup.vue";

import TeacherPicker from "./TeacherPicker.vue";

import map from "lodash/map";

@Component({
  components: {
    AiCard,
    AiPopup,
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

  addTeacher() {
    this.showPicker = false;
    this.$nextTick(() => {
      this.$router.push({
        name: "websiteEditingTeacher",
        params: {
          teacherId: "new",
        },
      });
    });
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
  width: 104px;
  height: 170px;
  padding: 0px 5px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 8px 14px 0px rgba(0, 0, 0, 0.06);
  border-radius: 8px;
  box-sizing: border-box;
  margin-right: 14px;
  margin-top: 10px;
  margin-bottom: 10px;

  & ::v-deep .ai-card__header {
    height: 85%;
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
</style>
