<template>
  <div class="wrapper">
    <ai-card v-if="innerTeacher.id" @click.native="onClick">
      <template v-slot:header>
        <img class="cover" :src="innerTeacher.avatar_url" />
      </template>
      <template v-slot:body>
        <div class="name">{{ innerTeacher.realname }} 老师</div>
      </template>
      <template v-slot:footer>
        <slot name="actions" />
      </template>
    </ai-card>
    <hui-dialog v-model="showDialog" :appendToBody="true">
      <div class="dialog">
        <img class="cover" :src="innerTeacher.avatar_url" />
        <div class="name">{{ innerTeacher.realname }} 老师</div>
        <div class="detail" v-if="innerTeacher.description">
          <ai-rich-text-render :value="innerTeacher.description" />
        </div>
      </div>
    </hui-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

import AiCard from "@/view/component/AiCard.vue";
import AiRichTextRender from "@/view/component/AiRichTextRender.vue";

import _get from "lodash/get";

@Component({
  components: {
    AiCard,
    AiRichTextRender,
  },
})
export default class Home extends Vue {
  @Prop({ type: Object, default: null }) websiteTeacher: any;
  @Prop({ type: Object, default: null }) teacher: any;
  @Prop({ type: Boolean, default: true }) enablePreview: boolean;

  showDialog: boolean = false;

  get innerTeacher() {
    return this.teacher || _get(this.websiteTeacher, "teacher", {});
  }

  onClick() {
    if (this.enablePreview) {
      this.showDialog = true;
    }
  }
}
</script>
<style lang="scss" scoped>
.wrapper {
  height: 160px;

  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 8px 14px 0px rgba(0, 0, 0, 0.06);
  border-radius: 8px;
  padding: 5px;

  & ::v-deep .ai-card__header {
    min-height: 80%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
.dialog {
  padding: 10px;
  .name {
    font-size: 18px;
    margin: 20px 0px;
  }
}
.cover {
  max-width: 100%;
  max-height: 100%;
  background: rgba(216, 216, 216, 1);
  border-radius: 4px;
}

.name {
  text-align: center;

  font-size: 13px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(74, 74, 74, 1);
  line-height: 18px;
}
</style>
